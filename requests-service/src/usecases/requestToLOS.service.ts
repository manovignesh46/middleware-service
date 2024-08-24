import { Injectable, Logger } from '@nestjs/common';
import { ApplicationStatus } from '../domain/enum/application-status.enum';
import { LOSStatus } from '../domain/enum/losStatus.enum';
import { IRequestToLOS } from '../domain/model/request-to-los.interface';
import { IRequestToLOSRepository } from '../domain/repository/request-to-los.repository.interface';
import { ILOSService } from '../domain/service/losService.interface';
import { IRequestToLOSService } from '../domain/service/requestToLOSService.interface';
import { CustomerIdCardDetailsDTO } from '../infrastructure/controllers/requests/dtos/customerIdCardDetails.dto';
import {
  ComparisonResults,
  LOSApplyLoansDTO,
  LOSSubmitLoansDTO,
  NationalIdDetails,
  OCR_MRZComparisonResults,
  SelfieLivenessDetails,
} from '../infrastructure/controllers/requests/dtos/losOutcome.dto';
import { SelfieLivenessDTO } from '../infrastructure/controllers/requests/dtos/selfieLiveness.dto';
import { ApplyLoansPresenter } from '../infrastructure/controllers/requests/presenters/apply-loans.presenter';
import {
  dateParserDashSeparatedFutureDate,
  formatDbDatestringForLOS,
  isValidDate,
} from '../infrastructure/service/helpers/date.helper';
import { IS3ClientService } from '../domain/service/s3-client-service.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RequestToLOSService implements IRequestToLOSService {
  private logger = new Logger(RequestToLOSService.name);

  private S3_ID_CARD_BUCKET_NAME: string;
  constructor(
    private readonly losService: ILOSService,
    private readonly requestToLosRepository: IRequestToLOSRepository,
    private readonly s3clientManager: IS3ClientService,
    private readonly configService: ConfigService,
  ) {
    this.S3_ID_CARD_BUCKET_NAME =
      this.configService.get<string>('S3_ID_CARD_BUCKET_NAME') ||
      'furaha-s3-scanned-images';
  }

  async submitLoans(
    targetUUID: string,
    loanAmount: number,
    stundetPCOId: string,
    offerId: string,
    tenor: number,
    repaymentFreq: string,
    preferredPaymentDay: string,
    customerId: string,
  ): Promise<boolean> {
    this.logger.log(this.submitLoans.name);

    const losResponseData: any = await this.losService.interactionTarget(
      targetUUID,
    );

    if (!losResponseData?.actions?.length) {
      this.logger.error('Workflow already completed');
      return;
    }

    const secondaryUUID: string = losResponseData['actions'][0]['uuid'];
    const nextAction: string = losResponseData['actions'][0]['action'];
    this.logger.log(`Next Action is: ${nextAction}`);

    const submitLoanOutcomeDTO: LOSSubmitLoansDTO = {
      loan_against_id: stundetPCOId,
      amount: loanAmount,
      variant_id: offerId,
      loan_tenure: tenor,
      repayment_frequency: repaymentFreq,
      preferred_payment_day: preferredPaymentDay,
    };

    let outcome;
    if (
      LOSStatus.SUBMIT_LOAN.trim().toLowerCase() ===
      nextAction.trim().toLowerCase()
    ) {
      outcome = await this.losService.interactionOutcome(
        secondaryUUID,
        submitLoanOutcomeDTO,
      );

      //Store LOS request details
      const requestToLos: IRequestToLOS = {
        customerId: customerId,
        secondaryUUID: secondaryUUID,
        applicationStatus: ApplicationStatus.SUBMIT_LOANS,
        dataToCRM: submitLoanOutcomeDTO,
        respFromCRM: outcome,
      } as any as IRequestToLOS;

      this.requestToLosRepository.create(requestToLos);
    } else {
      this.logger.error(`LOS Workflow is not in ${LOSStatus.SUBMIT_LOAN} step`);
    }
    return outcome;
  }

  async getLoanBoundaries(targetUUID: string): Promise<ApplyLoansPresenter> {
    const losRespAfterUpdateStudentDetails: any =
      await this.losService.interactionTarget(targetUUID);

    const minLoanAmount: string =
      losRespAfterUpdateStudentDetails['actions'][0]['payload'][
        'minimum_loan_amount'
      ];
    const maxLoanAmount: string =
      losRespAfterUpdateStudentDetails['actions'][0]['payload'][
        'loan_boundary'
      ];

    const presenter: ApplyLoansPresenter = new ApplyLoansPresenter();
    presenter.maxLoanAmount = parseFloat(maxLoanAmount);
    presenter.minLoanAmount = parseFloat(minLoanAmount);

    return presenter;
  }

  async applyLoans(
    targetUUID: string,
    idCardDetailsDTO: CustomerIdCardDetailsDTO,
    selfieLivenessDTO: SelfieLivenessDTO,
  ): Promise<boolean> {
    const losResponseData: any = await this.losService.interactionTarget(
      targetUUID,
    );
    this.logger.log(this.applyLoans.name);
    const secondaryUUID: string = losResponseData['actions'][0]['uuid'];
    const nextAction: string = losResponseData['actions'][0]['action'];
    this.logger.log(`Next Action is: ${nextAction}`);

    //ToDo remove this as it hardcodes the expiry date if the MRZ date is invalid
    let validNinExpiryDate;
    if (isValidDate(idCardDetailsDTO.mrzNINExpiryDate)) {
      validNinExpiryDate = dateParserDashSeparatedFutureDate(
        idCardDetailsDTO.mrzNINExpiryDate,
      );
    } else if (isValidDate(idCardDetailsDTO.ocrNINExpiryDate)) {
      validNinExpiryDate = idCardDetailsDTO.ocrNINExpiryDate;
    } else {
      validNinExpiryDate = '01.01.2050';
    }

    let validEditedNinExpiryDate;
    if (idCardDetailsDTO?.editedNINExpiryDate) {
      validEditedNinExpiryDate = formatDbDatestringForLOS(
        idCardDetailsDTO.editedNINExpiryDate as any as string,
      );
    } else validEditedNinExpiryDate = null;

    const nationalIdDetails: NationalIdDetails = {
      ocrGivenName: idCardDetailsDTO.ocrGivenName,
      ocrSurname: idCardDetailsDTO.ocrSurname,
      ocrNin: idCardDetailsDTO.ocrNIN,
      ocrDob: idCardDetailsDTO.ocrDOB,
      mrzGivenName: idCardDetailsDTO.mrzGivenName,
      mrzSurname: idCardDetailsDTO.mrzSurname,
      mrzNin: idCardDetailsDTO.mrzNIN,
      mrzDob: idCardDetailsDTO.mrzDOB,
      editedGivenName: idCardDetailsDTO.editedGivenName,
      editedSurname: idCardDetailsDTO.editedSurname,
      editedNin: idCardDetailsDTO.editedNIN,
      editedDob: idCardDetailsDTO.editedDOB,
      frontsideImageS3Url: await this.s3clientManager.getFileNameFromNormalUrl(
        idCardDetailsDTO.nonPresignedImageFront,
        this.S3_ID_CARD_BUCKET_NAME,
      ),
      backsideImageS3Url: await this.s3clientManager.getFileNameFromNormalUrl(
        idCardDetailsDTO.nonPresignedImageBack,
        this.S3_ID_CARD_BUCKET_NAME,
      ),
      faceImageS3Url: await this.s3clientManager.getFileNameFromNormalUrl(
        idCardDetailsDTO.nonPresignedFaceImage,
        this.S3_ID_CARD_BUCKET_NAME,
      ),
      ocrNINExpiry: idCardDetailsDTO.ocrNINExpiryDate,
      mrzNINExpiry: validNinExpiryDate,
      editedNINExpiry: validEditedNinExpiryDate,
      addressLine1: idCardDetailsDTO.addressLine1,
      addressLine2: idCardDetailsDTO.addressLine2,
      addressLine3: idCardDetailsDTO.addressLine3,
      city: idCardDetailsDTO.city,
      district: idCardDetailsDTO.district,
      countryOfResidence: idCardDetailsDTO.countryOfResidence,
      addressType: idCardDetailsDTO.addressType,
    };

    const selfieLivenessDetails: SelfieLivenessDetails = {
      faceMatchScore: selfieLivenessDTO.faceMatchScore.toString(),
      livenessScore: selfieLivenessDTO.livenessScore.toString(),
      faceMatchStatus: selfieLivenessDTO.faceMatchStatus,
      livenessMatchStatus: selfieLivenessDTO.livenessMatchStatus,
      faceMatchComparisonResult:
        selfieLivenessDTO.faceMatchComparisonResult.toString(),
      livenessComparisonResult:
        selfieLivenessDTO.livenessComparisonResult.toString(),
      selfieImagePreSignedS3URL:
        await this.s3clientManager.getFileNameFromSignedUrl(
          selfieLivenessDTO.selfieImagePreSignedS3URL,
          this.S3_ID_CARD_BUCKET_NAME,
        ),
      livenessVideoPreSignedS3URL:
        await this.s3clientManager.getFileNameFromSignedUrl(
          selfieLivenessDTO.livenessVideoPreSignedS3URL,
          this.S3_ID_CARD_BUCKET_NAME,
        ),
    };

    const comparisonResults: ComparisonResults = {
      telco_nin_mrz_status: idCardDetailsDTO.telcoNINMrzStatus,
      telco_name_mrz_status: idCardDetailsDTO.telcoNameMrzStatus,
      telco_name_mrz_percent: idCardDetailsDTO.telcoNameMrzPercent?.toString(),
    };

    const ocr_mrz_comparison_results: OCR_MRZComparisonResults = {
      surname_result:
        idCardDetailsDTO.ocrSurname === idCardDetailsDTO.mrzSurname
          ? 'MATCH'
          : 'NO_MATCH',
      givenname_result:
        idCardDetailsDTO.ocrGivenName === idCardDetailsDTO.mrzGivenName
          ? 'MATCH'
          : 'NO_MATCH',
      dob_result:
        idCardDetailsDTO.parsedOcrDOB === idCardDetailsDTO.mrzDOB
          ? 'MATCH'
          : 'NO_MATCH',
      nin_result:
        idCardDetailsDTO.ocrNIN === idCardDetailsDTO.mrzNIN
          ? 'MATCH'
          : 'NO_MATCH',
    };
    const applyLoanOutcomeDTO: LOSApplyLoansDTO = {
      national_id_details: nationalIdDetails,
      selfie_liveness_details: selfieLivenessDetails,
      comparison_results: comparisonResults,
      ocr_mrz_comparison_results: ocr_mrz_comparison_results,
    };

    let outcome;
    if (
      LOSStatus.LOAN_APPLICATION.trim().toLowerCase() ===
      nextAction.trim().toLowerCase()
    ) {
      outcome = await this.losService.interactionOutcome(
        secondaryUUID,
        applyLoanOutcomeDTO,
      );

      //Store LOS request details
      const requestToLos: IRequestToLOS = {
        customerId: idCardDetailsDTO.custId,
        secondaryUUID: secondaryUUID,
        applicationStatus: ApplicationStatus.APPLY_LOANS,
        dataToCRM: applyLoanOutcomeDTO,
        respFromCRM: outcome,
      } as any as IRequestToLOS;

      this.requestToLosRepository.create(requestToLos);
    } else {
      this.logger.error(
        `LOS Workflow is not in ${LOSStatus.LOAN_APPLICATION} step`,
      );
    }
    return outcome;
  }
}
