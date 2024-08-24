import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import stringSimilarity from 'string-similarity-js';
import { AddressType } from '../domain/enum/address-type.enum';
import { CountryCodes } from '../domain/enum/country-code.enum';
import { Gender } from '../domain/enum/gender.enum';
import { MatchStatus } from '../domain/enum/matchStatus.enum';
import { SelfieMatchStatus } from '../domain/enum/selfieMatchStatus.enum';
import { ThresholdConfigStatus } from '../domain/enum/thresholdConfigStatus.enum';
import { ICustIdCardDetails } from '../domain/model/custIdCardDetails.interface';
import { ICustPrimaryDetails } from '../domain/model/custPrimaryDetails.interface';
import { ICustScanCardSelfieCheckDetails } from '../domain/model/custScanCardSelfieCheckDetails.interface';
import { ICustTelco } from '../domain/model/custTelco.interface';
import { ICustIdCardDetailsRepository } from '../domain/repository/custIdCardDetailsRepository.interface';
import { ICustPrimaryDetailsRepository } from '../domain/repository/custPrimaryDetailsRepository.interface';
import { ICustScanCardSelfieCheckDetailsRepository } from '../domain/repository/custScanCardSelfieCheckDetailsRepository.interface';
import { ICustTelcoRepository } from '../domain/repository/custTelcoRepository.interface';
import { ICustIdCardDetailsService } from '../domain/services/custIdCardDetailsService.interface';
import { CustIdCardDetailsServiceDto } from '../infrastructure/controllers/customers/dtos/cust-id-card-details-service.dto';
import { GetAddressResponseDto } from '../infrastructure/controllers/customers/dtos/get-address-response.dto';
import {
  EditIdCardScanDTO,
  MRZ,
  OCR,
} from '../infrastructure/controllers/customers/dtos/idCardScan.dto';
import { retryCountDTO } from '../infrastructure/controllers/customers/dtos/retryCount.dto';
import { RetryUploadDTO } from '../infrastructure/controllers/customers/dtos/retryUpload.dto';
import { SelfieCheckDTO } from '../infrastructure/controllers/customers/dtos/selfieCheck.dto';
import {
  ThresholdConfigs,
  getThresholdConfigStatus,
} from '../infrastructure/controllers/customers/dtos/thresholdConfig.dto';
import { ScannedDetails } from '../infrastructure/controllers/customers/presenters/idCardScan.presenter';
import {
  RetryUpload,
  RetryUploadPresenter,
} from '../infrastructure/controllers/customers/presenters/retryUpload.presenter';
import { CustIdCardDetails } from '../infrastructure/entities/custIdCardDetails.entity';
import { CustScanCardSelfieCheckDetails } from '../infrastructure/entities/custScanCardSelfieCheckDetails.entity';
import { S3ManagerService } from '../infrastructure/services/s3-manager.service';
import {
  dateParserDashSeparatedFutureDate,
  dateParserDashSeparatedPastDate,
  dateStringToDateObject,
  isValidDate,
} from './helpers';
import { ICustToLOSService } from '../domain/services/custToLOSService.interface';

@Injectable()
export class CustIdCardDetailsService implements ICustIdCardDetailsService {
  private s3BucketName: string;
  private thresholdConfigs: ThresholdConfigs[];
  constructor(
    private readonly custIdCardDetailsRepository: ICustIdCardDetailsRepository,
    private readonly custScanCardSelfieMatchDetailsRepository: ICustScanCardSelfieCheckDetailsRepository,
    private readonly custPrimaryDetailsRepo: ICustPrimaryDetailsRepository,
    private readonly custTelcoRepo: ICustTelcoRepository,
    private readonly custToLosService: ICustToLOSService,
    private configService: ConfigService,
    private s3ManagerService: S3ManagerService,
  ) {
    this.s3BucketName =
      this.configService.get<string>('S3_ID_CARD_BUCKET_NAME') ||
      'furaha-s3-scanned-images';
    this.thresholdConfigs =
      this.configService.get<ThresholdConfigs[]>('THRESHOLD_CONFIGS');
  }
  async getAddress(customerId: string): Promise<GetAddressResponseDto> {
    this.logger.log(this.getAddress.name);
    const idCardDetails =
      await this.custIdCardDetailsRepository.findByCustIdOrFail(customerId);

    const {
      addressLine1,
      addressLine2,
      addressLine3,
      city,
      district,
      countryOfResidence,
      addressType,
    } = idCardDetails;

    const response: GetAddressResponseDto = {
      addressLine1,
      addressLine2,
      addressLine3,
      city,
      district,
      countryOfResidence,
      addressType,
    };

    return response;
  }

  async editIdCardDetails(
    custId: string,
    editIdCardScanDTO: EditIdCardScanDTO,
  ): Promise<ICustIdCardDetails> {
    const customerIdCardDetails =
      await this.custIdCardDetailsRepository.findByCustIdOrFail(custId);
    const updatedCustomerIdCardDetails: ICustIdCardDetails = {
      ...customerIdCardDetails,
      editedGivenName: editIdCardScanDTO.edited.givenName,
      editedSurname: editIdCardScanDTO.edited.surname,
      editedNIN: editIdCardScanDTO.edited.nin,
      editedDOB: dateStringToDateObject(editIdCardScanDTO.edited.dob),
      editedNINExpiryDate: dateStringToDateObject(
        editIdCardScanDTO.edited.ninExpiryDate,
      ),
    };

    return this.custIdCardDetailsRepository.save(updatedCustomerIdCardDetails);
  }

  private readonly logger = new Logger(CustIdCardDetails.name);

  async uploadIdCardDetails(
    custId: string,
    ocr: OCR,
    mrz: MRZ,
    custIdCardFrontImageFileName: string,
    custIdCardBackImageFileName: string,
    custFaceImageFileName: string,
  ): Promise<CustIdCardDetailsServiceDto> {
    this.logger.log(this.uploadIdCardDetails.name);
    const response = new CustIdCardDetailsServiceDto();

    response.scannedDetails = new ScannedDetails(ocr, mrz);

    const existingCustIdCard: ICustIdCardDetails =
      await this.custIdCardDetailsRepository.findByCustId(custId);
    this.logger.log(custIdCardFrontImageFileName);
    this.logger.log(custIdCardBackImageFileName);
    let custIdCardDetails: ICustIdCardDetails;
    if (existingCustIdCard != null) {
      custIdCardDetails = existingCustIdCard;
      custIdCardDetails.updatedAt = new Date();
    } else {
      custIdCardDetails = new CustIdCardDetails();
    }

    let mrzDOB: Date;
    if (isValidDate(mrz.dob)) {
      mrzDOB = dateStringToDateObject(dateParserDashSeparatedPastDate(mrz.dob));
    } else {
      mrzDOB = dateStringToDateObject('01.01.2000');
    }

    let parsedOcrDOB: Date;
    if (isValidDate(ocr.dob)) {
      parsedOcrDOB = dateStringToDateObject(ocr.dob);
    } else {
      parsedOcrDOB = new Date('1999-01-01'); // NEVER set this the same as default mrzDOB
    }

    let parsedMrzNINExpiryDate: Date;
    if (isValidDate(mrz.ninExpiryDate)) {
      parsedMrzNINExpiryDate = dateStringToDateObject(
        dateParserDashSeparatedFutureDate(mrz.ninExpiryDate),
      );
    } else {
      parsedMrzNINExpiryDate = new Date('1998-01-01');
    }

    let parsedOcrNINExpiryDate: Date;
    if (isValidDate(ocr.ninExpiryDate)) {
      parsedOcrNINExpiryDate = dateStringToDateObject(ocr.ninExpiryDate);
    } else {
      parsedOcrNINExpiryDate = new Date('1997-01-01'); // NEVER set this the same as default mrzNINExpiryDate
    }
    custIdCardDetails = {
      ...custIdCardDetails,
      ocrGivenName: ocr.givenName,
      ocrSurname: ocr.surname,
      ocrDOB: ocr.dob,
      parsedOcrDOB: parsedOcrDOB,
      ocrNIN: ocr.nin,
      ocrNINExpiryDate: ocr.ninExpiryDate,
      parsedOcrNINExpiryDate: parsedOcrNINExpiryDate,
      mrzGivenName: mrz.givenName,
      mrzSurname: mrz.surname,
      rawMrzDOB: mrz.dob,
      mrzDOB,
      mrzNIN: mrz.nin,
      mrzNINExpiryDate: mrz.ninExpiryDate,
      parsedMrzNINExpiryDate: parsedMrzNINExpiryDate,
      scannedCardImageFront: custIdCardFrontImageFileName,
      scannedCardImageBack: custIdCardBackImageFileName,
      faceImage: custFaceImageFileName,
      addressLine1: ocr.address.village || null, // If input is an empty string, save as null in DB
      addressLine2: ocr.address.parish || null,
      addressLine3: ocr.address.subCountry || null,
      city: ocr.address.county || null,
      district: ocr.address.district || null,
      countryOfResidence: ocr.address.countryOfResidence || CountryCodes.Uganda, // Default: UG,
      addressType: ocr.address.addressType || AddressType.RESIDENTIAL, // Default: RESIDENTIAL
      givenNameMatchStatus: response.scannedDetails.givenName.matched,
      surNameMatchStatus: response.scannedDetails.surname.matched,
      dobMatchStatus: response.scannedDetails.dob.matched,
      ninMatchStatus: response.scannedDetails.nin.matched,
      ninExpiryMatchStatus: response.scannedDetails.ninExpiryDate.matched,
    };
    custIdCardDetails.custId = custId;
    custIdCardDetails.createdAt = new Date();
    custIdCardDetails.updatedAt = new Date();
    this.logger.debug(custIdCardDetails);
    this.logger.log('function finished');

    //set up the S3 image url bob here
    const bucketName =
      this.configService.get<string>('S3_ID_CARD_BUCKET_NAME') ||
      'furaha-s3-scanned-images';
    this.logger.log(`S3 bucket name for ID Card Images: ${bucketName}`);
    const s3FrontImageFilename = custId + custIdCardFrontImageFileName;
    response.frontsideImagePresignedUrl =
      await this.s3ManagerService.generatePresignedUrl(
        bucketName,
        s3FrontImageFilename,
      );

    this.logger.debug(
      `Front Image Presigned URL: ${response.frontsideImagePresignedUrl}`,
    );
    const nonPresignedFrontImageUrl = this.s3ManagerService.getObjectNormalUrl(
      bucketName,
      s3FrontImageFilename,
    );
    const s3BackImageFilename = custId + custIdCardBackImageFileName;
    response.backsideImagePresignedUrl =
      await this.s3ManagerService.generatePresignedUrl(
        bucketName,
        s3BackImageFilename,
      );
    this.logger.debug(
      `Back Image Presigned URL: ${response.backsideImagePresignedUrl}`,
    );

    const nonPresignedBackImageUrl = this.s3ManagerService.getObjectNormalUrl(
      bucketName,
      s3BackImageFilename,
    );
    const s3FaceImageFilename = custId + custFaceImageFileName;
    response.faceImagePresignedUrl =
      await this.s3ManagerService.generatePresignedUrl(
        bucketName,
        s3FaceImageFilename,
      );
    this.logger.debug(
      `Face Image Presigned URL: ${response.faceImagePresignedUrl}`,
    );
    const nonPresignedFaceImageUrl = this.s3ManagerService.getObjectNormalUrl(
      bucketName,
      s3FaceImageFilename,
    );
    const custPriDetails: ICustPrimaryDetails =
      await this.custPrimaryDetailsRepo.getByCustomerId(custId);
    const custTelco: ICustTelco = await this.custTelcoRepo.findByLeadId(
      custPriDetails?.leadId,
    );

    let telcoName: string =
      (custTelco?.firstName || '') +
      ' ' +
      (custTelco?.middleName || ' ') +
      ' ' +
      (custTelco?.lastName || ' ');
    telcoName = telcoName.trim();

    custIdCardDetails.scannedCardImageFront =
      response.frontsideImagePresignedUrl;
    custIdCardDetails.scannedCardImageBack = response.backsideImagePresignedUrl;
    custIdCardDetails.faceImage = response.faceImagePresignedUrl;

    //non-presigned S3 URLs
    custIdCardDetails.nonPresignedImageFront = nonPresignedFrontImageUrl;
    custIdCardDetails.nonPresignedImageBack = nonPresignedBackImageUrl;
    custIdCardDetails.nonPresignedFaceImage = nonPresignedFaceImageUrl;

    custIdCardDetails.telcoNINMrzStatus =
      custTelco?.nationalIdNumber === custIdCardDetails.mrzNIN
        ? MatchStatus.MATCHED
        : MatchStatus.NOT_MATCHED;
    custIdCardDetails.telcoNameMrzPercent =
      stringSimilarity(
        custIdCardDetails.mrzGivenName + ' ' + custIdCardDetails.mrzSurname,
        telcoName,
      ) * 100;
    custIdCardDetails.telcoNameMrzStatus = await getThresholdConfigStatus(
      'NAME_MATCH',
      custIdCardDetails.telcoNameMrzPercent,
      this.thresholdConfigs,
    );

    await this.custIdCardDetailsRepository.save(custIdCardDetails);

    this.logger.log('function finished after save');

    for await (const macther of Object.values(response.scannedDetails)) {
      if (macther.matched === false) {
        macther.matched = true;
      }
    }

    this.logger.log('New NIN comparision added for MRZ and OCR');
    const isNINMatched: boolean =
      custIdCardDetails.mrzNIN === custTelco?.nationalIdNumber
        ? true
        : custIdCardDetails.ocrNIN === custTelco?.nationalIdNumber
        ? true
        : false;

    if (!isNINMatched) {
      this.logger.log(
        'NIN Mismatch occured for CustID: ' + custIdCardDetails.custId,
      );
      await this.custToLosService.terminateOngoingLoans(
        custIdCardDetails.custId,
        'Scanned NIN Mismatch',
      );
    }

    response.isNINMatched = isNINMatched;
    return response;
  }

  async selfieMatchDetails(
    custId: string,
    selfieCheckDto: SelfieCheckDTO,
  ): Promise<ICustScanCardSelfieCheckDetails> {
    //Read the configured thresholds value
    const faceMatchGoodThreshold =
      this.configService.get<number>('FACE_MATCH_GOOD_THRESHOLD') || 80;
    // const faceMatchMismatchhreshold = this.configService.get < number > ('FACE_MATCH_MISMATCH_THRESHOLD') || 49;
    const faceMatchPossibleThreshold =
      this.configService.get<number>('FACE_MATCH_POSSIBLE_THRESHOLD') || 50;
    const livenesMatchGoodThreshold =
      this.configService.get<number>('LIVENESS_MATCH_GOOD_THRESHOLD') || 80;
    // const livenessMatchMismatchhreshold = this.configService.get < number > ('LIVENESS_MATCH_MISMATCH_THRESHOLD') || 49;
    const livenessMatchPossibleThreshold =
      this.configService.get<number>('LIVENESS_MATCH_POSSIBLE_THRESHOLD') || 50;

    let faceMatchStatus;
    let livenessMatchStatus;
    if (selfieCheckDto.faceMatchScore >= faceMatchGoodThreshold) {
      faceMatchStatus = SelfieMatchStatus.GOOD;
    } else if (
      selfieCheckDto.faceMatchScore < faceMatchGoodThreshold &&
      selfieCheckDto.faceMatchScore > faceMatchPossibleThreshold
    ) {
      faceMatchStatus = SelfieMatchStatus.POSSIBLE;
    } else {
      faceMatchStatus = SelfieMatchStatus.MISMATCH;
    }

    if (selfieCheckDto.livenessScore >= livenesMatchGoodThreshold) {
      livenessMatchStatus = SelfieMatchStatus.GOOD;
    } else if (
      selfieCheckDto.livenessScore < livenesMatchGoodThreshold &&
      selfieCheckDto.livenessScore > livenessMatchPossibleThreshold
    ) {
      livenessMatchStatus = SelfieMatchStatus.POSSIBLE;
    } else {
      livenessMatchStatus = SelfieMatchStatus.MISMATCH;
    }

    if (
      faceMatchStatus === SelfieMatchStatus.GOOD &&
      livenessMatchStatus === SelfieMatchStatus.GOOD
    ) {
      let exisitngCustIdCard: ICustScanCardSelfieCheckDetails =
        await this.custScanCardSelfieMatchDetailsRepository.findByCustId(
          custId,
        );
      if (exisitngCustIdCard !== null) {
        //update workflow
        exisitngCustIdCard.updatedAt = new Date();
        exisitngCustIdCard.faceMatchScore = selfieCheckDto.faceMatchScore;
        exisitngCustIdCard.livenessScore = selfieCheckDto.livenessScore;
        exisitngCustIdCard.faceMatchComparisonResult =
          selfieCheckDto.faceMatchScore;
        exisitngCustIdCard.livenessComparisonResult =
          selfieCheckDto.livenessScore;
        exisitngCustIdCard.faceMatchStatus = faceMatchStatus;
        exisitngCustIdCard.livenessMatchStatus = livenessMatchStatus;
        exisitngCustIdCard.selfieImagePreSignedS3URL = '';
        exisitngCustIdCard.livenessVideoPreSignedS3URL = '';
      } else {
        exisitngCustIdCard = new CustScanCardSelfieCheckDetails();
        exisitngCustIdCard.custId = custId;
        exisitngCustIdCard.faceMatchScore = selfieCheckDto.faceMatchScore;
        exisitngCustIdCard.livenessScore = selfieCheckDto.livenessScore;
        exisitngCustIdCard.faceMatchComparisonResult =
          selfieCheckDto.faceMatchScore;
        exisitngCustIdCard.livenessComparisonResult =
          selfieCheckDto.livenessScore;
        exisitngCustIdCard.faceMatchStatus = faceMatchStatus;
        exisitngCustIdCard.livenessMatchStatus = livenessMatchStatus;
        exisitngCustIdCard.selfieImagePreSignedS3URL = '';
        exisitngCustIdCard.livenessVideoPreSignedS3URL = '';
        exisitngCustIdCard.createdAt = new Date();
      }
      if (selfieCheckDto.selfieImageName) {
        const s3SelfieImageFilename = custId + selfieCheckDto.selfieImageName;
        const selfiePresignedUrl =
          await this.s3ManagerService.generatePresignedUrl(
            this.s3BucketName,
            s3SelfieImageFilename,
          );
        exisitngCustIdCard.selfieImagePreSignedS3URL = selfiePresignedUrl;
      }
      this.logger.log(exisitngCustIdCard);
      exisitngCustIdCard =
        await this.custScanCardSelfieMatchDetailsRepository.save(
          exisitngCustIdCard,
        );

      this.logger.log('function finished after save');

      return exisitngCustIdCard;
    } else {
      this.custToLosService.terminateOngoingLoans(custId);
      return null;
    }
  }

  async getIdCardDetails(customerId: string): Promise<ICustIdCardDetails> {
    let idCardDetails: ICustIdCardDetails =
      await this.custIdCardDetailsRepository.findByCustId(customerId);
    if (idCardDetails === null) {
      idCardDetails = {
        createdAt: new Date(Date.parse('2023-04-08T20:29:40.521Z')),
        updatedAt: new Date(Date.parse('2023-04-08T20:29:40.521Z')),
        id: '80510fa9-cd34-4dc3-9afa-0f87aaddc97d',
        custId: customerId,
        ocrGivenName: 'HAROLD',
        ocrSurname: 'WANYAMA',
        ocrNIN: 'CM8105110600CH',
        ocrDOB: '03.12.1990',
        parsedOcrDOB: new Date('1990-12-03'),
        ocrNINExpiryDate: '03.12.2010',
        parsedOcrNINExpiryDate: new Date('2010-12-03'),
        ocrGender: Gender.MALE,
        ocrNationality: 'IN',
        ocrDateOfExpiry: new Date(Date.parse('2023-04-08T20:29:40.521Z')),
        ocrCardNo: '12345',
        ocrSignature: 'asd',
        ocrFace: 'asdasd',
        ocrIdFront: 'asdas',
        ocrIdBack: 'asdas',

        mrzGivenName: 'HAROLD',
        mrzSurname: 'WANYAMA',
        mrzNIN: '020847327',
        mrzNINExpiryDate: '03.12.2010',
        parsedMrzNINExpiryDate: new Date('2010-12-03'),
        rawMrzDOB: '03-12-61',
        mrzDOB: new Date(Date.parse('1961-12-03T20:29:40.521Z')),

        mrzGender: Gender.MALE,
        mrzExpirationDate: new Date(Date.parse('2023-04-08T20:29:40.521Z')),
        mrzIssuedDate: new Date(Date.parse('2023-04-08T20:29:40.521Z')),
        mrzCountry: 'asd',
        mrzNationality: 'IN',
        mrzString: 'asdasd',

        requestLoadJSON: null,
        scannedCardImageFront: 'e72605e5-4eaf-4843-863f-0481d69dbe19.jpg',
        scannedCardImageBack: '4e518e89-20ee-4c00-aac7-1d3211466e82.jpg',
        faceImage: '51ca92a5-a304-4b74-a479-87af14ad037e.jpg',
        editedGivenName: null,
        editedSurname: null,
        editedNIN: null,
        editedDOB: null,
        editedNINExpiryDate: null,
        telcoNINMrzStatus: MatchStatus.MATCHED,
        telcoNameMrzStatus: ThresholdConfigStatus.MEDIUM,
        telcoNameMrzPercent: 87,

        addressLine1: 'NANSANA WEST',
        addressLine2: 'NANSANA',
        addressLine3: 'NANSANA DIVISION',
        city: 'KYADONDO',
        district: 'WAKISO',
        countryOfResidence: CountryCodes.Uganda,
        addressType: AddressType.RESIDENTIAL,

        givenNameMatchStatus: true,
        surNameMatchStatus: true,
        dobMatchStatus: true,
        ninMatchStatus: true,
        ninExpiryMatchStatus: true,

        nonPresignedImageFront: 'nonPresignedFront',
        nonPresignedImageBack: 'nonPresignedBack',
        nonPresignedFaceImage: 'nonPresignedFaceImage',
      };
    }
    return idCardDetails;
  }

  async getSelfieLiveness(
    customerId: string,
  ): Promise<ICustScanCardSelfieCheckDetails> {
    let selfieLiveness: ICustScanCardSelfieCheckDetails =
      await this.custScanCardSelfieMatchDetailsRepository.findByCustId(
        customerId,
      );
    if (selfieLiveness === null) {
      selfieLiveness = {
        id: '80510fa9-cd34-4dc3-9afa-0f87aaddc97d',
        custId: customerId,
        faceMatchScore: 99.088,
        livenessScore: 85,
        faceMatchStatus: SelfieMatchStatus.GOOD,
        livenessMatchStatus: SelfieMatchStatus.GOOD,
        faceMatchComparisonResult: 99.088,
        livenessComparisonResult: 85,
        selfieImagePreSignedS3URL: null,
        livenessVideoPreSignedS3URL: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        retryCount: null,
      };
    }
    return selfieLiveness;
  }

  async retryUpload(
    custId: string,
    retryUploadDTOs: RetryUploadDTO[],
  ): Promise<RetryUploadPresenter> {
    const presenter = new RetryUploadPresenter();

    const selfieLiveness: ICustScanCardSelfieCheckDetails =
      await this.custScanCardSelfieMatchDetailsRepository.findByCustId(custId);

    let retryCount: retryCountDTO = JSON.parse(selfieLiveness.retryCount);

    if (retryCount == null) {
      retryCount = new retryCountDTO();
    }

    for await (const retryUploadDTO of retryUploadDTOs) {
      retryCount[retryUploadDTO.type] = retryCount[retryUploadDTO.type] + 1;
      const selfiePresignedUrl =
        await this.s3ManagerService.generatePresignedUrl(
          this.s3BucketName,
          retryUploadDTO.imageName,
        );

      const retryUpload = new RetryUpload();
      retryUpload.imageName = retryUploadDTO.imageName;
      retryUpload.url = selfiePresignedUrl;
      retryUpload.retryCount = retryCount[retryUploadDTO.type];

      presenter[retryUploadDTO.type] = retryUpload;
    }

    selfieLiveness.retryCount = JSON.stringify(retryCount);
    await this.custScanCardSelfieMatchDetailsRepository.save(selfieLiveness);

    return presenter;
  }
}
