import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Gender } from '../domain/enum/gender.enum';
import { OvaProvider } from '../domain/enum/ova-provider.enum';
import { ResponseStatusCode } from '../domain/enum/responseStatusCode.enum';
import { TelcoOpType } from '../domain/enum/telcoOp.enum';
import { WhitelistStatus } from '../domain/enum/whitelistStatus.enum';
import { ICustOtp } from '../domain/model/custOtp.interface';
import { ICustPrimaryDetails } from '../domain/model/custPrimaryDetails.interface';
import { mockStudentDetails2 } from '../domain/model/mocks/student-details.mock';
import { IOfferConfig } from '../domain/model/offerConfig.interface';
import { IStudentDetails } from '../domain/model/studentDetails.interface';
import { IWhitelistedStudentDetails } from '../domain/model/whitelistedStudentDetails.interface';
import { ICustOtpRepository } from '../domain/repository/custOtpRepository.interface';
import { ICustPrimaryDetailsRepository } from '../domain/repository/custPrimaryDetailsRepository.interface';
import { IOfferConfigRepository } from '../domain/repository/offerConfigRepository.interface';
import { IStudentDetailsRepository } from '../domain/repository/studentDetailsRepository.interface';
import { IWhitelistedStudentDetailsRepository } from '../domain/repository/whitelistedStudentDetailsRepository.interface';
import { ICustToLOSService } from '../domain/services/custToLOSService.interface';
import { ISchoolAggregatorService } from '../domain/services/schoolAggregatorService.interface';
import { IStudentDetailsService } from '../domain/services/studentDetailsService.interface';
import { SchoolAggregatorConnectionError } from '../infrastructure/controllers/common/errors/school-aggregator-connection.error';
import { StatusMessagePresenter } from '../infrastructure/controllers/common/statusMessage.presenter';
import { AddStudentDetailsDTO } from '../infrastructure/controllers/customers/dtos/addStudentDetails.dto';
import { ConfirmStudentDetailsDto } from '../infrastructure/controllers/customers/dtos/confirmStudentDetails.dto';
import { DeleteStudentDetailsDTO } from '../infrastructure/controllers/customers/dtos/deleteStudentDetails.dto';
import {
  RetrievePegPayStudentDetailsDto,
  RetrieveSchoolPayStudentDetailsDto,
  RetrieveStudentDetailsDto,
  SchoolAggregatorGetStudentDetailsRequestDto,
} from '../infrastructure/controllers/customers/dtos/retrieveStudentDetails.dto';
import { WhitelistedDTO } from '../infrastructure/controllers/customers/dtos/whitelisted.dto';
import { ConfirmStudentDetailsPresenter } from '../infrastructure/controllers/customers/presenters/confirmStudentDetails.presenter';
import { OfferDetail } from '../infrastructure/controllers/customers/presenters/dashBoard.presenter';
import { RetrieveStudentDetailsPresenter } from '../infrastructure/controllers/customers/presenters/retrieveStudentDetails.presenter';
import { StudentDetails } from '../infrastructure/entities/studentDetails.entity';
import { WhitelistedStudentDetails } from '../infrastructure/entities/whitelistedStudentDetails.entity';
import { AggregatorWhiteListingService } from '../infrastructure/services/aggregatorWhitelisting.service';
import { PegPaySchoolAggregator } from '../infrastructure/services/pegpay-school-aggregator.service';
import { SchoolPaySchoolAggregatorService } from '../infrastructure/services/schoolpay-school-aggregator.service';
import { IntegratorName } from '../modules/error-mapping/IntegratorName.enum';
import { EndpointName } from '../modules/error-mapping/endpoint-name.enum';
import { IntegratorErrorMappingService } from '../modules/error-mapping/integrator-error-mapping.service';
import { generateNumberStringOfLength, getTimestamp } from './helpers';
import { WhitelistedStudentDetailsRepository } from '../infrastructure/repository/whitelistedStudentDetails.repository';

@Injectable()
export class StudentDetailsService implements IStudentDetailsService {
  private logger: Logger = new Logger(StudentDetails.name);
  private IS_MOCK_PEGPAY_STUDENT_DETAILS: boolean;
  private IS_MOCK_SCHOOLPAY_STUDENT_DETAILS: boolean;
  private TOTAL_TERMS: number;
  private COMPARE_WHITELISTED_SCHOOL: boolean;
  constructor(
    private readonly studentDetailsRepository: IStudentDetailsRepository,
    private readonly pegPaySchoolAggregator: PegPaySchoolAggregator,
    private readonly schoolPaySchoolAggregator: SchoolPaySchoolAggregatorService,
    private readonly custToLOSService: ICustToLOSService,
    private readonly custPrimaryDetailsRepository: ICustPrimaryDetailsRepository,
    private readonly custOtpRepository: ICustOtpRepository,
    private readonly offerConfigRepository: IOfferConfigRepository,
    private readonly whiteListedStudentDetailsRepository: IWhitelistedStudentDetailsRepository,
    private readonly whitelistingService: AggregatorWhiteListingService,
    private readonly configService: ConfigService,
    private readonly integratorErrorMappingService: IntegratorErrorMappingService,
  ) {
    this.IS_MOCK_PEGPAY_STUDENT_DETAILS =
      this.configService.get<string>('IS_MOCK_PEGPAY_STUDENT_DETAILS') ===
        'true' || false;
    this.IS_MOCK_SCHOOLPAY_STUDENT_DETAILS =
      this.configService.get<string>('IS_MOCK_SCHOOLPAY_STUDENT_DETAILS') ===
        'true' || false;
    this.TOTAL_TERMS = this.configService.get<number>('TOTAL_TERMS') || 3;
    this.COMPARE_WHITELISTED_SCHOOL =
      this.configService.get<string>('COMPARE_WHITELISTED_SCHOOL') === 'true';
  }

  async addWhitelistedStudentDetails(
    custId: string,
    addStudentDetailsDTO: AddStudentDetailsDTO,
  ): Promise<boolean> {
    this.logger.log(this.addWhitelistedStudentDetails.name);

    const custPrimaryDetails: ICustPrimaryDetails =
      await this.custPrimaryDetailsRepository.getCustomerByCustomerId(custId);

    let whitelistedStudentDetails: IWhitelistedStudentDetails =
      await this.whiteListedStudentDetailsRepository.findStudentByLeadIdAndStudentRegNumberAndSchoolCode(
        custPrimaryDetails.leadId,
        addStudentDetailsDTO.studentRegnNumber,
        addStudentDetailsDTO.schoolCode,
      );

    if (!whitelistedStudentDetails) {
      whitelistedStudentDetails = new WhitelistedStudentDetails();
      whitelistedStudentDetails.studentId = addStudentDetailsDTO.studentId;
      whitelistedStudentDetails.studentFullName =
        addStudentDetailsDTO.studentName;
      whitelistedStudentDetails.schoolName = addStudentDetailsDTO.schoolName;
      whitelistedStudentDetails.studentSchoolCode =
        addStudentDetailsDTO.schoolCode;
      whitelistedStudentDetails.studentSchoolRegnNumber =
        addStudentDetailsDTO.studentRegnNumber;
      whitelistedStudentDetails.studentGender =
        addStudentDetailsDTO.studentGender;
      whitelistedStudentDetails.studentClass =
        addStudentDetailsDTO.studentClass;
      whitelistedStudentDetails.aggregatorId =
        addStudentDetailsDTO.aggregatorId === 'SCHOOLPAY' || 'SCHOOL_PAY'
          ? 'SCHOOL_PAY'
          : 'PEGPAY';
      whitelistedStudentDetails.leadId = custPrimaryDetails.leadId;
      whitelistedStudentDetails.associatedCustomerId = custId;
      whitelistedStudentDetails.isStudentDeleted = false;
      whitelistedStudentDetails.isCustomerConfirmed = false;
      whitelistedStudentDetails.currentStatus = WhitelistStatus.ADDED;

      this.whiteListedStudentDetailsRepository.save(whitelistedStudentDetails);
      return true;
    }
    return false;
  }

  async deleteWhitelistedStudentDetails(
    custId: string,
    studentId: string,
  ): Promise<boolean> {
    this.logger.log(this.deleteWhitelistedStudentDetails.name);

    const custPrimaryDetails: ICustPrimaryDetails =
      await this.custPrimaryDetailsRepository.getCustomerByCustomerId(custId);

    const whitelistedStudentDetails: IWhitelistedStudentDetails =
      await this.whiteListedStudentDetailsRepository.findStudentByLeadIdAndStudentId(
        custPrimaryDetails.leadId,
        studentId,
      );
    if (whitelistedStudentDetails) {
      this.whiteListedStudentDetailsRepository.removeStudentDetails(
        whitelistedStudentDetails,
      );
      return true;
    }
    return false;
  }

  async getWhiteListedStudent(
    custId: string,
  ): Promise<RetrieveStudentDetailsPresenter[]> {
    this.logger.log(this.getWhiteListedStudent.name);

    const custPrimaryDetails: ICustPrimaryDetails =
      await this.custPrimaryDetailsRepository.getCustomerByCustomerId(custId);

    const whitelistedStudentDetails: IWhitelistedStudentDetails[] =
      await this.whiteListedStudentDetailsRepository.findAllStudentsByLeadId(
        custPrimaryDetails.leadId,
      );

    return RetrieveStudentDetailsPresenter.whitelistedStudentDetailsPresenter(
      whitelistedStudentDetails,
    );
  }

  async getStudentDetails(
    studentPCOId: string,
    custId: string,
  ): Promise<IStudentDetails> {
    this.logger.log(this.getStudentDetails.name);
    return await this.studentDetailsRepository.findByPCOIdAndCustId(
      studentPCOId,
      custId,
    );
  }

  async getStudentOfferDetails(offerId: string): Promise<IOfferConfig> {
    this.logger.log(this.getStudentOfferDetails.name);
    return await this.offerConfigRepository.findOfferId(offerId);
  }

  async deleteStudent(
    custId: string,
    deleteStudentDetailsDTO: DeleteStudentDetailsDTO,
  ): Promise<StatusMessagePresenter<null>> {
    this.logger.log(this.deleteStudent.name);
    const studentDetails: StudentDetails =
      await this.studentDetailsRepository.findByStudentIdCustIdRegID(
        deleteStudentDetailsDTO.studentId,
        custId,
        deleteStudentDetailsDTO.studentRegnNum,
      );
    if (studentDetails !== null) {
      studentDetails.isStudentDeleted = true;
      this.studentDetailsRepository.save(studentDetails);

      return new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        'Deleted successfully',
        undefined,
      );
    } else {
      return new StatusMessagePresenter(
        ResponseStatusCode.FAIL,
        'Student not found,',
        undefined,
      );
    }
  }

  async getAllStudent(
    custId: string,
  ): Promise<RetrieveStudentDetailsPresenter[]> {
    this.logger.log(this.getAllStudent.name);
    const studentDetailsList: IStudentDetails[] =
      await this.studentDetailsRepository.findStudentByCustId(custId);

    const pcoidList: string[] = [];
    const uniqueStudentList: IStudentDetails[] = [];
    if (!(studentDetailsList == null)) {
      for await (const studentDetails of studentDetailsList) {
        if (!pcoidList.includes(studentDetails.studentPCOId)) {
          pcoidList.push(studentDetails.studentPCOId);
          uniqueStudentList.push(
            await this.studentDetailsRepository.findByPCOIdAndCustId(
              studentDetails.studentPCOId,
              custId,
            ),
          );
        }
      }
    }
    return RetrieveStudentDetailsPresenter.studentDetailsPresenter(
      uniqueStudentList,
    );
  }

  async retrieveStudentDetails(
    retrieveStudentDetailsDto: RetrieveStudentDetailsDto,
    custId: string,
  ): Promise<RetrieveStudentDetailsPresenter> {
    this.logger.log(this.retrieveStudentDetails.name);
    let schoolAggregator: ISchoolAggregatorService;
    let schoolAggregatorDto: SchoolAggregatorGetStudentDetailsRequestDto;
    const custPrimaryDetails: ICustPrimaryDetails =
      await this.custPrimaryDetailsRepository.getCustomerByCustomerId(custId);
    const custOtp: ICustOtp = await this.custOtpRepository.getById(
      custPrimaryDetails.leadId,
    );
    const requestReference: string = await this.generateRequestReference(
      custId,
      retrieveStudentDetailsDto.aggregatorId,
    );
    this.logger.log(`Request Reference: ${requestReference}`);

    //set schoolAggregator and schoolAggregatorDto based on aggregatorId
    switch (retrieveStudentDetailsDto.aggregatorId) {
      case 'PEGPAY':
        this.logger.log('PEGPAY School Aggregator');
        schoolAggregator = this.pegPaySchoolAggregator;
        schoolAggregatorDto = new RetrievePegPayStudentDetailsDto(
          retrieveStudentDetailsDto.studentRegnNumber,
          retrieveStudentDetailsDto.schoolCode,
        );
        break;

      case 'SCHOOL_PAY':
        this.logger.log('SCHOOL_PAY School Aggregator');
        schoolAggregator = this.schoolPaySchoolAggregator;
        schoolAggregatorDto = new RetrieveSchoolPayStudentDetailsDto(
          retrieveStudentDetailsDto.studentRegnNumber,
          retrieveStudentDetailsDto.schoolCode,
          requestReference,
        );
        break;

      default:
        this.logger.error(
          `Unknown Aggregator: ${retrieveStudentDetailsDto.aggregatorId} `,
        );
        throw new Error('Unknown Aggregator');
    }

    let studentDetails: IStudentDetails;
    try {
      studentDetails = await schoolAggregator.retrieveStudentDetails(
        schoolAggregatorDto,
      );
    } catch (err) {
      //Mock Student Details
      if (err instanceof SchoolAggregatorConnectionError) {
        if (
          (retrieveStudentDetailsDto.aggregatorId == 'PEGPAY' &&
            this.IS_MOCK_PEGPAY_STUDENT_DETAILS) ||
          (retrieveStudentDetailsDto.aggregatorId == 'SCHOOL_PAY' &&
            this.IS_MOCK_SCHOOLPAY_STUDENT_DETAILS)
        ) {
          this.logger.warn(
            'Using Mock Student Details Data. To Disable set IS_MOCK_PEGPAY_STUDENT_DETAILS / IS_MOCK_SCHOOLPAY_STUDENT_DETAILS=false',
          );
          studentDetails = {
            ...mockStudentDetails2,
            studentFullName: 'Cornelius Conn Ackelo',
            studentFirstName: 'Cornelius',
            studentMiddleName: 'Conn',
            studentSurname: 'Ackelo',
            studentGender: Gender.FEMALE,
            studentId: undefined, //autogen by TypeORM
            studentSchoolRegnNumber: schoolAggregatorDto.studentRegnNumber,
          };
        } else if (err.httpStatus) {
          this.integratorErrorMappingService.validateHttpCode(
            err.httpStatus,
            err.message,
            retrieveStudentDetailsDto.aggregatorId as IntegratorName, //SCHOOL_PAY or PEGPAY
            EndpointName.GET_STUDENT_DETAILS,
          );
        } else throw err; //Let Exception Filter handle SchoolAggregatorConnectionError
      } else throw err;
    }

    if ((studentDetails.responseStatusCode as any) != 0) {
      if (
        (retrieveStudentDetailsDto.aggregatorId == 'PEGPAY' &&
          this.IS_MOCK_PEGPAY_STUDENT_DETAILS) ||
        (retrieveStudentDetailsDto.aggregatorId == 'SCHOOL_PAY' &&
          this.IS_MOCK_SCHOOLPAY_STUDENT_DETAILS)
      ) {
        this.logger.warn(
          'Using Mock Student Details Data. To Disable set IS_MOCK_PEGPAY_STUDENT_DETAILS / IS_MOCK_SCHOOLPAY_STUDENT_DETAILS=false',
        );
        studentDetails = {
          ...mockStudentDetails2,
          studentId: undefined, //autogen by TypeORM
          studentSchoolRegnNumber: schoolAggregatorDto.studentRegnNumber,
        };
      }
    }

    if (!studentDetails.studentSchoolRegnNumber) {
      studentDetails.studentSchoolRegnNumber =
        retrieveStudentDetailsDto.studentRegnNumber;
    }
    studentDetails.aggregatorId = retrieveStudentDetailsDto.aggregatorId;
    studentDetails.associatedCustomerId = custId;
    studentDetails.requestReferenceNumber = requestReference;

    //Get Telco provider (MTN/AIRTEL) from custOtp
    if (custOtp?.telcoOp == TelcoOpType.AIRTEL_UG) {
      studentDetails.ovaProvider = OvaProvider.AIRTEL;

      /*
        for PEGPAY, airtelOva is null and studentOva will be a value
        for SCHOOL_PAY, studentOva is null and airtelOva has a value
        always take the truthy value to prevent overriding to null
      */
      studentDetails.studentOva =
        studentDetails.airtelOva || studentDetails.studentOva;
      studentDetails.airtelOva =
        studentDetails.studentOva || studentDetails.airtelOva;
    } else {
      //Default is MTN OVA details (Also applies to telcoOp 'NO-CHECK')
      studentDetails.ovaProvider = OvaProvider.MTN;

      /*
        for PEGPAY, mtnOva is null and studentOva will be a value
        for SCHOOL_PAY, studentOva is null and mtnOva has a value
        always take the truthy value to prevent overriding to null
      */
      studentDetails.studentOva =
        studentDetails.mtnOva || studentDetails.studentOva;
      studentDetails.mtnOva =
        studentDetails.studentOva || studentDetails.mtnOva;
    }
    const savedStudentDetails = await this.studentDetailsRepository.save(
      studentDetails,
    );

    //Loose check, value may be number not string
    if (studentDetails.responseStatusCode != '0') {
      return null;
    }

    if (retrieveStudentDetailsDto.aggregatorId === 'SCHOOL_PAY') {
      let whitelistedStudentDetails: WhitelistedStudentDetails =
        await this.whiteListedStudentDetailsRepository.findByPaymentCodeInRegNumber(
          custOtp.leadId,
          savedStudentDetails.studentPaymentCode,
        );
      if (!whitelistedStudentDetails) {
        whitelistedStudentDetails =
          await this.whiteListedStudentDetailsRepository.findByRegNumberInPaymentCode(
            custOtp.leadId,
            savedStudentDetails.studentSchoolRegnNumber,
          );
      }
      if (whitelistedStudentDetails) {
        whitelistedStudentDetails.studentSchoolRegnNumber =
          savedStudentDetails.studentSchoolRegnNumber;
        whitelistedStudentDetails.studentPaymentCode =
          savedStudentDetails.studentPaymentCode;
        whitelistedStudentDetails.studentFullName =
          savedStudentDetails.studentFullName;
        whitelistedStudentDetails.studentSchoolCode =
          savedStudentDetails.studentSchoolCode;
      } else {
        whitelistedStudentDetails =
          WhitelistedStudentDetails.transformStudentDetailToWhiteListed(
            savedStudentDetails,
            custOtp.leadId,
          );
      }
      this.whiteListedStudentDetailsRepository.save(whitelistedStudentDetails);
    }

    let schoolNameComparisonFailed = false;
    if (
      this.COMPARE_WHITELISTED_SCHOOL &&
      custOtp.whitelistCriteria !== 'MSISDN-Whitelisted'
    ) {
      if (custOtp.whitelistCriteria !== savedStudentDetails.schoolName)
        schoolNameComparisonFailed = true;
    }

    return new RetrieveStudentDetailsPresenter(
      savedStudentDetails.studentId,
      savedStudentDetails.studentFullName,
      savedStudentDetails.studentSchoolCode,
      savedStudentDetails.schoolName,
      savedStudentDetails.studentSchoolRegnNumber,
      savedStudentDetails.studentClass,
      savedStudentDetails.studentGender,
      savedStudentDetails.currentSchoolFees,
      savedStudentDetails.studentPCOId,
      savedStudentDetails.aggregatorId,
      savedStudentDetails.studentPaymentCode,
      schoolNameComparisonFailed,
    );
  }

  async confirmStudentDetails(
    custId: string,
    confirmStudentDetailsDto: ConfirmStudentDetailsDto,
  ): Promise<ConfirmStudentDetailsPresenter> {
    // let existingStudentDetails: IStudentDetails =
    //   await this.studentDetailsRepository.findBySchoolCodeCustIdRegId(
    //     //find by studentId
    //     confirmStudentDetailsDto.schoolCode,
    //     custId,
    //     confirmStudentDetailsDto.studentRegnNumber,
    //   );

    let existingStudentDetails: IStudentDetails =
      await this.studentDetailsRepository.findByStudentUUID(
        confirmStudentDetailsDto.studentId,
      );

    if (existingStudentDetails === null) {
      throw new Error('No Such Student found in Database');
    } else {
      //update existing Student Details in case any were edited
      existingStudentDetails.studentFullName =
        confirmStudentDetailsDto.studentName;
      existingStudentDetails.studentGender =
        confirmStudentDetailsDto.studentGender;
      existingStudentDetails.studentClass =
        confirmStudentDetailsDto.studentClass;
      existingStudentDetails.studentSchoolCode =
        confirmStudentDetailsDto.schoolCode;
      existingStudentDetails.studentSchoolRegnNumber =
        confirmStudentDetailsDto.studentRegnNumber;
      existingStudentDetails.schoolName = confirmStudentDetailsDto.schoolName;
      existingStudentDetails.currentSchoolFees =
        confirmStudentDetailsDto.currentOutstandingFee;

      //Customer confirm details
      existingStudentDetails.isCustomerConfirmed = true;
    }

    existingStudentDetails = await this.studentDetailsRepository.save(
      existingStudentDetails,
    );

    const addStudentDetails: AddStudentDetailsDTO = new AddStudentDetailsDTO();
    addStudentDetails.studentId = confirmStudentDetailsDto.studentId;
    addStudentDetails.studentName = confirmStudentDetailsDto.studentName;
    addStudentDetails.schoolCode = confirmStudentDetailsDto.schoolCode;
    addStudentDetails.schoolName = confirmStudentDetailsDto.schoolName;
    addStudentDetails.studentClass = confirmStudentDetailsDto.studentClass;
    addStudentDetails.studentGender = confirmStudentDetailsDto.studentGender;
    addStudentDetails.studentRegnNumber =
      confirmStudentDetailsDto.studentRegnNumber;
    addStudentDetails.aggregatorId = confirmStudentDetailsDto.aggregatorId;
    // addStudentDetails.aggregatorIdNumber = confirmStudentDetailsDto.a
    this.addWhitelistedStudentDetails(custId, addStudentDetails);

    const custPrimaryDetails: ICustPrimaryDetails =
      await this.custPrimaryDetailsRepository.getCustomerByCustomerId(custId);

    await this.custToLOSService.cancelLoanWorkflow(
      custId,
      custPrimaryDetails.msisdnCountryCode,
      custPrimaryDetails.msisdn,
    );

    const fullMsisdn =
      custPrimaryDetails.msisdnCountryCode + custPrimaryDetails.msisdn;
    await this.custToLOSService.createRepeatWorkflow(
      custPrimaryDetails.leadId,
      fullMsisdn,
    );

    let computedAmount = 0;
    if (
      !confirmStudentDetailsDto.currentOutstandingFee ||
      confirmStudentDetailsDto.currentOutstandingFee === 0
    ) {
      let whiteListedResponse: WhitelistedDTO;

      if (
        confirmStudentDetailsDto.aggregatorId === 'SCHOOLPAY' ||
        'SCHOOL_PAY'
      ) {
        whiteListedResponse =
          await this.whitelistingService.getSchoolpayWhiteListing(
            custPrimaryDetails.msisdnCountryCode,
            custPrimaryDetails.msisdn,
          );
      } else {
        whiteListedResponse =
          await this.whitelistingService.getPegpayWhiteListing(
            custPrimaryDetails.msisdnCountryCode,
            custPrimaryDetails.msisdn,
          );
      }

      let whitelistedStudentDetails: WhitelistedStudentDetails;
      if (
        whiteListedResponse &&
        whiteListedResponse?.student_details &&
        whiteListedResponse?.student_details?.length !== 0
      ) {
        for await (const studentDetails of whiteListedResponse.student_details) {
          whitelistedStudentDetails =
            await this.whiteListedStudentDetailsRepository.findByPaymentCodeInRegNumber(
              custPrimaryDetails.leadId,
              studentDetails.studentRegnNumber,
            );

          if (!whitelistedStudentDetails) {
            whitelistedStudentDetails =
              await this.whiteListedStudentDetailsRepository.findByRegNumberInPaymentCode(
                custPrimaryDetails.leadId,
                studentDetails.studentRegnNumber,
              );
          }

          if (
            confirmStudentDetailsDto.studentRegnNumber ===
              whitelistedStudentDetails.studentSchoolRegnNumber ||
            confirmStudentDetailsDto.studentRegnNumber ===
              whitelistedStudentDetails.studentPaymentCode
          ) {
            whitelistedStudentDetails.totalTermsFee =
              studentDetails.term_1_fee +
              studentDetails.term_2_fee +
              studentDetails.term_3_fee;
            whitelistedStudentDetails.currentStatus = WhitelistStatus.ADDED;

            whitelistedStudentDetails =
              await this.whiteListedStudentDetailsRepository.save(
                whitelistedStudentDetails,
              );
            break;
          }
        }
      }

      computedAmount = whitelistedStudentDetails?.totalTermsFee
        ? whitelistedStudentDetails?.totalTermsFee / this.TOTAL_TERMS
        : 50000;
      existingStudentDetails.isComputedAmount = true;
    }

    const presenter: ConfirmStudentDetailsPresenter =
      await this.custToLOSService.updateStudentDetails(
        custPrimaryDetails.leadId,
        existingStudentDetails,
        confirmStudentDetailsDto.aggregatorId,
        computedAmount.toString(),
      );

    if (existingStudentDetails.studentPCOId === null) {
      existingStudentDetails.studentPCOId = presenter.studentPCOId;
    }
    existingStudentDetails.isLOSUpdated = true;
    existingStudentDetails = await this.studentDetailsRepository.save(
      existingStudentDetails,
    );

    const offerConfig: IOfferConfig =
      await this.offerConfigRepository.findOfferId(
        confirmStudentDetailsDto.offerId,
      );

    const offersDetail: OfferDetail = {
      offerId: offerConfig.offerId,
      offerName: offerConfig.offerName,
      offerDescription: offerConfig.offerDescription,
      offerImage: '',
      isActive: 'Active' === offerConfig.activeStatus,
      moreDetails: {
        tenure: offerConfig.tenure,
        roi: offerConfig.roi,
        repaymentFrequency: offerConfig.repaymentFrequency,
        noOfInstallment: offerConfig.noOfInstallment,
        limit: offerConfig.offerLimit,
        applicationfee: offerConfig.applicationFee,
      },
    };

    if (presenter !== null) {
      presenter.offersDetail = offersDetail;
      presenter.studentPCOId = existingStudentDetails.studentPCOId;
    }

    return presenter;
  }

  private async generateRequestReference(
    custId: string,
    aggregatorId: string,
  ): Promise<string> {
    this.logger.log(this.generateRequestReference.name);
    let randomNumberStringLength: number = this.configService.get<number>(
      'SCHOOL_AGGREGATOR_RANDOM_NUMBER_LENGTH',
    );
    if (typeof randomNumberStringLength !== 'number')
      randomNumberStringLength = 2;
    const refPart1 =
      custId + generateNumberStringOfLength(randomNumberStringLength);
    const refPart2 =
      (await this.studentDetailsRepository.countByCustomerIdAggregatorId(
        custId,
        aggregatorId,
      )) + 1;
    const refPart3 =
      (await this.studentDetailsRepository.countByAggregatorId(aggregatorId)) +
      1;
    const refPart4 = getTimestamp(); //YYYYMMDDHHmmss
    const requestReference = [refPart1, refPart2, refPart3, refPart4].join('-');
    return requestReference;
  }
}
