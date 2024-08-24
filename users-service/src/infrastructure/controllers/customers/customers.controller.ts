import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Logger,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { EntityNotFoundError } from 'typeorm';
import { ApiBodyWithJWTBearerToken } from '../../../decorators/api-body-with-jwt.decorator';
import { User } from '../../../decorators/request-user.decorator';
import { StatusMessageWrapper } from '../../../decorators/status-message-wrapper.decorator';
import { DedupStatus } from '../../../domain/enum/dedupStatus.enum';
import { IdType } from '../../../domain/enum/id-type.enum';
import { OtpAction } from '../../../domain/enum/otp-action.enum';
import { ResponseMessage } from '../../../domain/enum/responseMessage.enum';
import { ResponseStatusCode } from '../../../domain/enum/responseStatusCode.enum';
import { ICustIdCardDetails } from '../../../domain/model/custIdCardDetails.interface';
import { ICustPrimaryDetails } from '../../../domain/model/custPrimaryDetails.interface';
import { ICustScanCardSelfieCheckDetails } from '../../../domain/model/custScanCardSelfieCheckDetails.interface';
import { IGeneralOtp } from '../../../domain/model/general-otp.interface';
import { IOfferConfig } from '../../../domain/model/offerConfig.interface';
import { IStudentDetails } from '../../../domain/model/studentDetails.interface';
import { ICustIdCardDetailsService } from '../../../domain/services/custIdCardDetailsService.interface';
import { ICustOtpService } from '../../../domain/services/custOtpService.interface';
import { ICustScoringDataService } from '../../../domain/services/custScoringDataService.interface';
import { ICustToLMSService } from '../../../domain/services/custToLMSService.interface';
import { ICustToLOSService } from '../../../domain/services/custToLOSService.interface';
import { ICustomersService } from '../../../domain/services/customersService.interface';
import {
  IExperianService,
  KycEnquiryDto,
} from '../../../domain/services/experian-service.interface';
import { IStudentDetailsService } from '../../../domain/services/studentDetailsService.interface';
import { ITriggerOtpService } from '../../../domain/services/triggerOtp.interface';
import { IVerifyOtpService } from '../../../domain/services/verifyOtp.interface';
import { InternalAuthGuard } from '../../../guards/internal-auth-guard';
import { IpWhitelistingInterceptor } from '../../../interceptors/ip-whitelisting.interceptor';
import { CustScoringDataStatusEnum } from '../../../usecases/custScoringData.service';
import { ForgotPinService } from '../../../usecases/forgot-pin-service';
import { isDotSeparatedDate } from '../../../usecases/helpers';
import { CustIdCardDetails } from '../../entities/custIdCardDetails.entity';
import { CustOtp } from '../../entities/custOtp.entity';
import { CustScanCardSelfieCheckDetails } from '../../entities/custScanCardSelfieCheckDetails.entity';
import { CustScoringData } from '../../entities/custScoringData.entity';
import { OfferConfig } from '../../entities/offerConfig.entity';
import { StudentDetails } from '../../entities/studentDetails.entity';
import { AuthServiceClient } from '../../services/auth-service-client/auth-service-client.service';
import { GeneralOtpService } from '../../services/general-otp.service';
import { PushNotificationService } from '../../services/push-notification-service';
import { CustomerAlreadyExistsError } from '../common/errors/customer-already-exists.error';
import { ErrorMessage } from '../common/errors/enums/errorMessage.enum';
import { LeadNotEnhancedError } from '../common/errors/lead-not-enhanced.error';
import { StatusMessagePresenter } from '../common/statusMessage.presenter';
import { AddStudentDetailsDTO } from './dtos/addStudentDetails.dto';
import { ConfirmStudentDetailsDto } from './dtos/confirmStudentDetails.dto';
import { CreateCustomerFromEnhancedLeadDto } from './dtos/create-customer-from-enhanced-lead.dto';
import { CreditScoreDto } from './dtos/creditScore.dto';
import { CreditScoreServiceDto } from './dtos/creditScoreService.dto';
import { CustIdCardDetailsServiceDto } from './dtos/cust-id-card-details-service.dto';
import { DashboardResponseDTO } from './dtos/dashboardResponse.dto';
import { DeleteStudentDetailsDTO } from './dtos/deleteStudentDetails.dto';
import { DeviceDetailsDTO } from './dtos/deviceDetails.dto';
import {
  ForgotPinOtpTriggerDto,
  GeneralOtpTriggerDto,
  RegisterNewDeviceOtpTriggerDto,
} from './dtos/general-otp-trigger.dto';
import { GeneralOtpVerifyDto } from './dtos/general-otp-verify.dto';
import { GetAddressResponseDto } from './dtos/get-address-response.dto';
import { EditIdCardScanDTO, IdCardScanDTO } from './dtos/idCardScan.dto';
import { MTNApprovalPollingDTO } from './dtos/mtnApprovalPolling.dto';
import { MTNApprovalServiceDTO } from './dtos/mtnApprovalService.dto';
import { MTNConsentStatusDTO } from './dtos/mtnConsentStatus.dto';
import { MTNOptOutDTO } from './dtos/mtnOptOut.dto';
import { RegisterForPushNotificationDto } from './dtos/register-for-push-notification.dto';
import { ResumeActionDTO } from './dtos/resumeAction.dto';
import { RetrieveStudentDetailsDto } from './dtos/retrieveStudentDetails.dto';
import { RetryUploadDTO } from './dtos/retryUpload.dto';
import { SelfieCheckDTO } from './dtos/selfieCheck.dto';
import { SubmitTicketDTO } from './dtos/submitTicket.dto';
import { TriggerOtpDto } from './dtos/triggerOtp.dto';
import { TriggerOtpServiceDto } from './dtos/triggerOtpService.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { validateOtpTrigger } from './dtos/validation';
import { VerifyOtpVerifiedKeyDto } from './dtos/verify-otp-verification-key.dto';
import { VerifyOtpDto } from './dtos/verifyOtpDto';
import { VerifyOtpServiceDto } from './dtos/verifyOtpService.dto';
import { ConfirmStudentDetailsPresenter } from './presenters/confirmStudentDetails.presenter';
import { CreditScorePresenter } from './presenters/creditScore.presenter';
import {
  CreateCustPrimaryDetailsPresenter as CustPriDetailsIdPresenter,
  CustomerLoanPresenter,
} from './presenters/customer.presenter';
import { CustomerMsisdnPresenter } from './presenters/customerMsisdn.presenter';
import { DevicePresenter } from './presenters/device.presenter';
import { EKycPresenter } from './presenters/ekyc.presenter';
import { FSResponsePresenter } from './presenters/fsResponse.presenter';
import { GetCustomerFromFullMsisdnPresenter } from './presenters/get-customer-from-full-msisdn.presenter';
import { OtpVerifyGeneralPresenter } from './presenters/otp-verify-general.presenter';
import { OTPTriggerGeneralPresenter } from './presenters/otpTriggerGeneral.presenter';
import { ProfilePersonalDataPresenter } from './presenters/profilePersonalData.presenter';
import { RetrieveStudentDetailsPresenter } from './presenters/retrieveStudentDetails.presenter';
import { RetryUploadPresenter } from './presenters/retryUpload.presenter';
import { TargetApiUuidPresenter } from './presenters/target-api-uuid.presenter';
import { TriggerOtpPresenter } from './presenters/triggerOtp.presenter';
import { VerifyOtpPresenter } from './presenters/verifyOtp.presenter';
import { VerifyOtpVerifiedPresenter } from './presenters/verifyOtpVerified.presenter';
import { WhitelistedSchoolPresenter } from './presenters/whitelistedSchool.presenter';

@Controller('/v1/customers')
export class CustomersController {
  constructor(
    private readonly customersService: ICustomersService,
    private readonly triggerOtpService: ITriggerOtpService,
    private readonly custScoringService: ICustScoringDataService,
    private readonly verifyOtpService: IVerifyOtpService,
    private readonly studentDetailsService: IStudentDetailsService,
    private readonly custToLOSService: ICustToLOSService,
    private readonly custToLMSService: ICustToLMSService,
    private readonly custIdCardService: ICustIdCardDetailsService,
    private readonly experianService: IExperianService,
    private readonly forgotPinService: ForgotPinService,
    private readonly generalOtpService: GeneralOtpService,
    private readonly custOTPService: ICustOtpService,
    private readonly authServiceClient: AuthServiceClient,
    private readonly pushNotificationService: PushNotificationService,
  ) {}
  private readonly logger = new Logger(CustomersController.name);

  @ApiOkResponse({ type: CustomerLoanPresenter })
  @Get('loans')
  @ApiTags('Loan Application')
  @ApiBearerAuth('jwt-access-token')
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async getCustomerLoan(
    @Query('offset', new DefaultValuePipe(1), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
    @Query('isActive', new DefaultValuePipe(true), ParseBoolPipe)
    isActive: boolean,
    @Query('startDate') startDate: string,
    @Query('startDate') endDate: string,
  ) {
    const custId = '926e32b8-2704-428e-9649-5b31757772ea'; //TODO get the cust ID from a method(will decode token)
    const data = await this.custToLOSService.getCustomerLoansFromLOS(
      custId,
      isActive,
      offset,
      limit,
      startDate,
      endDate,
    );
    this.logger.log(data);
    return data;
  }

  @Post('/create-customer-from-lead')
  @ApiTags('Internal Endpoints')
  @ApiBody({ type: CreateCustomerFromEnhancedLeadDto })
  @StatusMessageWrapper(
    CustPriDetailsIdPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.CUSTOMER_CREATED,
  )
  async createCustomerFromEnhancedLead(
    @Body() payload: { msisdnCountryCode: string; msisdn: string },
  ) {
    const { msisdnCountryCode, msisdn } = payload;
    let custPrimaryDetails: ICustPrimaryDetails;
    try {
      custPrimaryDetails =
        await this.customersService.createCustomerFromEnhancedLead(
          msisdnCountryCode,
          msisdn,
        );
    } catch (err) {
      let status: number;
      let message: string;
      if (err instanceof CustomerAlreadyExistsError) {
        status = ResponseStatusCode.USERNAME_EXISTS;
        message = ResponseMessage.USERNAME_EXISTS;
      } else if (err instanceof LeadNotEnhancedError) {
        status = ResponseStatusCode.LEAD_NOT_ENHANCED;
        message = ResponseMessage.LEAD_NOT_ENHANCED;
      } else {
        throw err;
      }
      return new StatusMessagePresenter(status, message);
    }
    const status = ResponseStatusCode.SUCCESS;
    const message = ResponseMessage.CUSTOMER_CREATED;
    const custPrimaryDetailsPresenter = new CustPriDetailsIdPresenter(
      custPrimaryDetails,
    );
    return new StatusMessagePresenter<CustPriDetailsIdPresenter>(
      status,
      message,
      custPrimaryDetailsPresenter,
    );
  }

  @Delete(':customerid')
  @ApiTags('Profile and Dashboard')
  @ApiBearerAuth('jwt-access-token')
  @StatusMessageWrapper(
    null,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.CUSTOMER_DELETED,
  )
  async deleteCustomerNotOnboardedInCognito(
    @Param('customerid') customerId: string,
  ) {
    try {
      await this.customersService.deleteCustomer(customerId);
      const status = ResponseStatusCode.SUCCESS;
      const message = ResponseMessage.CUSTOMER_DELETED;
      return new StatusMessagePresenter(status, message);
    } catch (err) {
      this.logger.error(`error deleting customer ${customerId}`);
      throw err;
    }
  }

  @Post('update-customer')
  @UseGuards(InternalAuthGuard)
  @ApiTags('Internal Endpoints')
  @ApiBody({ type: UpdateCustomerDto })
  @StatusMessageWrapper(
    null,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.UPDATE_CUSTOMER_SUCCESS,
  )
  async updateCustomer(@Body() updateCustomerDto: UpdateCustomerDto) {
    const { customerId, cognitoId } = updateCustomerDto;
    const updatedCustomer = await this.customersService.updateCustomer(
      customerId,
      cognitoId,
    );
    if (updatedCustomer) {
      return new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        ResponseMessage.UPDATE_CUSTOMER_SUCCESS,
      );
    } else {
      return new StatusMessagePresenter(
        ResponseStatusCode.FAIL,
        ResponseMessage.FAIL,
      );
    }
  }

  @Post('verify-otp-key')
  @UseGuards(InternalAuthGuard)
  @ApiTags('General OTP Flow')
  @ApiBody({ type: VerifyOtpVerifiedKeyDto })
  @StatusMessageWrapper(
    VerifyOtpVerifiedPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.SUCCESS,
  )
  async verifyOtpVerifiedKey(
    @Body() verifyOtpVerifiedKeyDto: VerifyOtpVerifiedKeyDto,
  ) {
    const { customerId, otpVerifiedKey, otpAction } = verifyOtpVerifiedKeyDto;
    const validCustomer = await this.generalOtpService.verifyOtpVerfiedKey(
      customerId,
      otpVerifiedKey,
      otpAction,
    );
    if (validCustomer) {
      const { msisdnCountryCode, msisdn, cognitoId } = validCustomer;
      return new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        ResponseMessage.SUCCESS,
        new VerifyOtpVerifiedPresenter(
          true,
          msisdnCountryCode,
          msisdn,
          cognitoId,
        ),
      );
    } else {
      return new StatusMessagePresenter(
        ResponseStatusCode.FAIL,
        ResponseMessage.VERIFY_OTP_KEY_FAIL,
        { isVerified: false },
      );
    }
  }

  @Post('otp-trigger')
  @UseInterceptors(IpWhitelistingInterceptor)
  @ApiTags('Onboarding')
  @ApiBody({ type: TriggerOtpDto })
  @StatusMessageWrapper(
    TriggerOtpPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.OTP_GENERATED,
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  async triggerOtp(@Body() triggerOtpDto: TriggerOtpDto) {
    let status: number;
    let message: string;
    let triggerOtpPresenter: TriggerOtpPresenter;
    message = validateOtpTrigger(triggerOtpDto);
    if (!(message == null))
      return new StatusMessagePresenter<TriggerOtpPresenter>(
        ResponseStatusCode.VALIDATION_FAIL,
        message,
        null,
      );

    let triggerOtpServiceDto: TriggerOtpServiceDto;
    try {
      this.logger.log('Preprod logs here');

      triggerOtpServiceDto = await this.triggerOtpService.triggerOtp({
        ...new CustOtp(),
        ...triggerOtpDto,
      });
    } catch (e) {
      if (
        e.message == ErrorMessage.EXISTING_LEAD_WITH_DIFFERENT_NIN_OR_MSISDN
      ) {
        return new StatusMessagePresenter(
          ResponseStatusCode.MSISDN_OR_NIN_MISMATCH,
          ResponseMessage.MSISDN_OR_NIN_MISMATCH,
        );
      }
      throw e;
    }
    if (triggerOtpServiceDto.approvalId) {
      return new StatusMessagePresenter(
        ResponseStatusCode.MTN_OPT_IN_TRIGGERED,
        ResponseMessage.MTN_OPT_IN_TRIGGERED,
        { approvalId: triggerOtpServiceDto.approvalId },
      );
    }

    if (triggerOtpServiceDto.telcoNotFound) {
      return new StatusMessagePresenter(
        ResponseStatusCode.TELCO_NOT_FOUND,
        ResponseMessage.TELCO_NOT_FOUND,
      );
    }

    if (triggerOtpServiceDto.isOperatorRestricted) {
      return new StatusMessagePresenter(
        ResponseStatusCode.MSISDN_OPERATOR_RESTRICTED,
        ResponseMessage.MSISDN_OPERATOR_RESTRICTED,
        null,
      );
    }

    //ToDo Get Telco Details
    const telcoDetails = {};

    if (triggerOtpServiceDto.whiteListErrorMsg) {
      status = ResponseStatusCode.WHITE_LISTED_ERROR;
      message = triggerOtpServiceDto.whiteListErrorMsg;
    } else {
      triggerOtpPresenter = new TriggerOtpPresenter(
        triggerOtpServiceDto.lead,
        telcoDetails,
        triggerOtpServiceDto.whiteListedJSON,
      );

      //Already Onboarded as a customer
      if (triggerOtpServiceDto.dedupStatus === DedupStatus.DEDUP_MATCH) {
        return new StatusMessagePresenter(
          ResponseStatusCode.DEDUPE_MATCH,
          ResponseMessage.DEDUPE_MATCH,
        );
      } else if (
        triggerOtpServiceDto.dedupStatus === DedupStatus.DEDUP_NO_MATCH
      ) {
        status = ResponseStatusCode.SUCCESS;
        message = ResponseMessage.OTP_GENERATED;
      } else if (
        triggerOtpServiceDto.dedupStatus ===
        DedupStatus.DEDUP_MATCH_OPTOUT_OR_CLOSED
      ) {
        status = ResponseStatusCode.DEDUP_MATCH_OPTOUT_OR_CLOSED;
        message = ResponseMessage.DEDUPE_MATCH_OPTOUT_OR_CLOSED;
      } else {
        //WIP and previous OTP is not expired
        status = ResponseStatusCode.WIP;
        message = ResponseMessage.OTP_GENERATED;
      }
    }

    return new StatusMessagePresenter<TriggerOtpPresenter>(
      status,
      message,
      triggerOtpPresenter,
    );
  }

  /* Throws TypeOrmError, OtpExpiredError and OtpLockedError */
  @Post('/verify-otp')
  @ApiTags('Onboarding')
  @ApiBody({ type: VerifyOtpDto })
  @StatusMessageWrapper(
    VerifyOtpPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.VERIFICATION_SUCCESS,
  )
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const { msisdnCountryCode, msisdn, otp } = verifyOtpDto;
    const verifyOtpServiceDto: VerifyOtpServiceDto =
      await this.verifyOtpService.verifyOtp(msisdnCountryCode, msisdn, otp);
    const {
      isNINMatch,
      verified,
      otpCount,
      createdAt,
      updatedAt,
      leadStatus,
      preferredName,
    } = verifyOtpServiceDto;

    let leadId: string;
    if (verified) {
      leadId = verifyOtpServiceDto.leadId;
    }
    const verifyOtpPresenter = new VerifyOtpPresenter(
      leadId,
      leadStatus,
      preferredName,
      msisdnCountryCode,
      msisdn,
      otpCount,
      createdAt,
      updatedAt,
    );
    if (!verified) {
      return new StatusMessagePresenter<VerifyOtpPresenter>(
        ResponseStatusCode.VERIFICATION_FAIL,
        ResponseMessage.VERIFICATION_FAIL,
        verifyOtpPresenter,
      );
    }
    if (!isNINMatch) {
      return new StatusMessagePresenter(
        ResponseStatusCode.USER_ONBOARDING_TERMINATED,
        ResponseMessage.NIN_NOT_MATCHED,
        null,
      );
    }

    let status: number;
    let message: string;
    if (verified) {
      status = ResponseStatusCode.SUCCESS;
      message = ResponseMessage.VERIFICATION_SUCCESS;
    } else {
      status = ResponseStatusCode.VERIFICATION_FAIL;
      message = ResponseMessage.VERIFICATION_FAIL;
    }
    return new StatusMessagePresenter<VerifyOtpPresenter>(
      status,
      message,
      verifyOtpPresenter,
    );
  }

  @Post('/retrieve-student-details')
  @ApiTags('Loan Application')
  @ApiBodyWithJWTBearerToken({ type: RetrieveStudentDetailsDto })
  @StatusMessageWrapper(
    RetrieveStudentDetailsPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.RETRIEVE_STUDENT_DETAILS_SUCCESS,
  )
  async retrieveStudentDetails(
    @Body() retrieveStudentDetailsDto: RetrieveStudentDetailsDto,
    @User() custId: string,
  ) {
    const presenter: RetrieveStudentDetailsPresenter =
      await this.studentDetailsService.retrieveStudentDetails(
        retrieveStudentDetailsDto,
        custId,
      );

    if (!presenter) {
      return new StatusMessagePresenter(
        ResponseStatusCode.RETRIEVE_STUDENT_DETAILS_FAIL,
        ResponseMessage.RETRIEVE_STUDENT_DETAILS_FAIL,
      );
    } else if (presenter.schoolNameComparisonFailed) {
      return new StatusMessagePresenter(
        ResponseStatusCode.STUDENT_SCHOOL_NAME_MISMATCH,
        ResponseMessage.STUDENT_SCHOOL_NAME_MISMATCH.replace(
          '${selected_school_name}',
          presenter.schoolName,
        ),
        presenter,
      );
    }

    return new StatusMessagePresenter(
      ResponseStatusCode.SUCCESS,
      ResponseMessage.RETRIEVE_STUDENT_DETAILS_SUCCESS,
      presenter,
    );
  }

  @Post('/confirm-student-details')
  @ApiTags('Loan Application')
  @ApiBodyWithJWTBearerToken({ type: ConfirmStudentDetailsDto })
  @StatusMessageWrapper(
    ConfirmStudentDetailsPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.CONFIRM_STUDENT_DETAILS_SUCCESS,
  )
  async confirmStudentDetails(
    @User() custId: string,
    @Body() confirmStudentDetailsDto: ConfirmStudentDetailsDto,
  ) {
    if (custId === null || custId.length === 0)
      return new StatusMessagePresenter(
        ResponseStatusCode.FAIL,
        'Customer token not found',
        null,
      );
    const presenter: ConfirmStudentDetailsPresenter =
      await this.studentDetailsService.confirmStudentDetails(
        custId,
        confirmStudentDetailsDto,
      );

    if (presenter !== null) {
      return new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        ResponseMessage.CONFIRM_STUDENT_DETAILS_SUCCESS,
        presenter,
      );
    }
    return new StatusMessagePresenter(
      ResponseStatusCode.WIP,
      ResponseMessage.CONFIRM_STUDENT_DETAILS_WIP,
      null,
    );
  }

  @Post('/credit-score')
  @ApiTags('Onboarding')
  @ApiBody({ type: CreditScoreDto })
  @StatusMessageWrapper(
    CreditScorePresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.CREDIT_SCORE_SUCCESS,
  )
  async creditScore(@Body() creditScoreDto: CreditScoreDto) {
    this.logger.log(creditScoreDto);

    let creditScoreServiceDto: CreditScoreServiceDto;
    try {
      creditScoreServiceDto = await this.custScoringService.findCustScoringData(
        creditScoreDto.leadId,
        new CustScoringData(
          creditScoreDto.leadId,
          creditScoreDto.employmentType,
          creditScoreDto.monthlyGrossIncome,
          creditScoreDto.activeBankAccount,
          creditScoreDto.yearsInCurrentPlace,
          creditScoreDto.maritalStatus,
          creditScoreDto.numberOfSchoolKids,
        ),
      );
    } catch (e) {
      if (e.message == 'Experian Error') {
        return new StatusMessagePresenter(
          ResponseStatusCode.GENERIC_ERROR_500,
          ResponseMessage.SCHOOL_AGGREGATOR_DOWN, //3rd Party Down Error
        );
      }
    }

    const creditScorePresenter = new CreditScorePresenter(
      creditScoreServiceDto.isTelcoKycMatch,
      creditScoreServiceDto.isSanctionStatusMatch,
    );
    let status: number;
    let message: string;

    switch (creditScoreServiceDto?.status) {
      case CustScoringDataStatusEnum.SUCCESS:
        status = ResponseStatusCode.SUCCESS;
        message = ResponseMessage.CREDIT_SCORE_SUCCESS;
        break;
      case CustScoringDataStatusEnum.TELCO_KYC_FAILED:
        status = ResponseStatusCode.USER_ONBOARDING_TERMINATED;
        message = ResponseMessage.CREDIT_SCORE_FAIL_KYC_MISMATCH;
        break;
      case CustScoringDataStatusEnum.SANCTION_SCREENING_FAILED:
        status = ResponseStatusCode.USER_ONBOARDING_TERMINATED;
        message = ResponseMessage.CREDIT_SCORE_FAIL_SANCTION_HIT;
        break;
      case CustScoringDataStatusEnum.ONBOARDING_CRITERIA_FAILED:
        status = ResponseStatusCode.USER_ONBOARDING_TERMINATED;
        message = creditScoreServiceDto.message;
        break;
      //Edge Case - Telco Details should already be present
      case CustScoringDataStatusEnum.NO_TELCO_KYC_DATA:
        status = ResponseStatusCode.GENERIC_ERROR_500;
        message = ResponseMessage.CREDIT_SCORE_FAIL_MISSING_KYC;
        break;
      //Edge Case - Refinitiv data should already be present
      case CustScoringDataStatusEnum.NO_SANCTION_SCREENING_DATA:
        status = ResponseStatusCode.GENERIC_ERROR_500;
        message = ResponseMessage.CREDIT_SCORE_FAIL_MISSING_SANCTION;
        break;
      default:
        break;
    }

    return new StatusMessagePresenter(status, message, creditScorePresenter);
  }

  @Post('/id-scan')
  @ApiTags('Loan Application')
  @ApiBodyWithJWTBearerToken({ type: IdCardScanDTO })
  @StatusMessageWrapper(
    CustIdCardDetailsServiceDto,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.ID_SCAN_SUCCESS,
  )
  async idCardScanner(
    @User() custId: string,
    @Body() idCardScanDTO: IdCardScanDTO,
  ) {
    const custIdCardServiceDto: CustIdCardDetailsServiceDto =
      await this.custIdCardService.uploadIdCardDetails(
        custId,
        idCardScanDTO.ocr,
        idCardScanDTO.mrz,
        idCardScanDTO.frontsideImageName,
        idCardScanDTO.backsideImageName,
        idCardScanDTO.faceImageName,
      );

    let isMismatch = false;
    for (const matcher of Object.values(custIdCardServiceDto.scannedDetails)) {
      if (matcher.matched === false) isMismatch = true;
    }
    let status: number;
    let message: string;
    if (!custIdCardServiceDto.isNINMatched) {
      status = ResponseStatusCode.SCANNED_NIN_TELCO_NIN_MISMATCH;
      message = ResponseMessage.SCANNED_NIN_TELCO_NIN_MISMATCH;
    } else if (isMismatch) {
      status = ResponseStatusCode.ID_SCAN_MISMATCH;
      message = ResponseMessage.ID_SCAN_MISMATCH;
    } else {
      status = ResponseStatusCode.SUCCESS;
      message = ResponseMessage.ID_SCAN_SUCCESS;
    }
    return new StatusMessagePresenter(status, message, custIdCardServiceDto);
  }

  @Patch('/id-scan')
  @ApiTags('Loan Application')
  @ApiBodyWithJWTBearerToken({ type: EditIdCardScanDTO })
  @StatusMessageWrapper(
    null,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.ID_SCAN_EDITED_SUCCESS,
  )
  async editIdScanDetails(
    @User() custId: string,
    @Body() editIdCardScanDTO: EditIdCardScanDTO,
  ) {
    if (editIdCardScanDTO?.edited?.dob) {
      const isValidDate = isDotSeparatedDate(editIdCardScanDTO.edited.dob);
      if (!isValidDate) {
        throw new Error(
          'Edited DOB is invalid or in the wrong format. Make sure to use dd.mm.yyyy format',
        );
      }
    }

    if (editIdCardScanDTO?.edited?.ninExpiryDate) {
      const isValidDate = isDotSeparatedDate(
        editIdCardScanDTO?.edited?.ninExpiryDate,
      );
      if (!isValidDate) {
        throw new Error(
          'Edited ninExpiryDate is invalid or in the wrong format. Make sure to use dd.mm.yyyy format',
        );
      }
      const formattedNinExpiryDate = editIdCardScanDTO?.edited?.ninExpiryDate
        .split('.')
        .reverse()
        .join('-'); // get input to yyyy-mm-dd format
      if (Date.now() > new Date(formattedNinExpiryDate).getTime()) {
        throw new Error(`Edited ninExpiryDate is in the past`);
      }
    }

    await this.custIdCardService.editIdCardDetails(custId, editIdCardScanDTO);
    const status = ResponseStatusCode.SUCCESS;
    const message = ResponseMessage.ID_SCAN_EDITED_SUCCESS;
    return new StatusMessagePresenter(status, message);
  }

  @Get('dashboard-details')
  @ApiTags('Profile and Dashboard')
  @ApiBearerAuth('jwt-access-token')
  @StatusMessageWrapper(
    DashboardResponseDTO,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.RESUME_ONBOARDING_SUCCESS,
  )
  async getDashBoardDetails(@User() custId: string) {
    if (custId === null || custId.length === 0)
      return new StatusMessagePresenter(
        ResponseStatusCode.FAIL,
        'Customer token not found',
        null,
      );
    const dashBoardDetails: DashboardResponseDTO =
      await this.customersService.dashBoardDetails(custId);
    let status = ResponseStatusCode.SUCCESS;
    let msg = 'You have pre-approved amount';
    this.logger.debug(`dashBoardDetails: ${JSON.stringify(dashBoardDetails)}`);
    if (dashBoardDetails !== undefined) {
      if (
        dashBoardDetails.rejectionReason !== null &&
        dashBoardDetails.rejectionReason !== undefined &&
        dashBoardDetails.rejectionReason.length > 0
      ) {
        // msg = dashBoardDetails.rejectionReason;
        msg = ResponseMessage.DASHBOARD_REJECTION;
        status = ResponseStatusCode.DASHBOARD_REJECTION;
      }
      return new StatusMessagePresenter(status, msg, {
        ...dashBoardDetails.dashBoardPresenter,
      });
    } else return new StatusMessagePresenter(3020, 'Failure', null);
  }

  @Post('/id-selfie-match')
  @ApiTags('Loan Application')
  @ApiBodyWithJWTBearerToken({ type: SelfieCheckDTO })
  @StatusMessageWrapper(
    CustScanCardSelfieCheckDetails,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.SELFIE_CHECK_SUCCESS,
  )
  async selfieCheck(
    @User() custId: string,
    @Body() selfieCheckDTO: SelfieCheckDTO,
  ) {
    const selfieMatchDetails: CustScanCardSelfieCheckDetails =
      await this.custIdCardService.selfieMatchDetails(custId, selfieCheckDTO);
    if (selfieMatchDetails) {
      return new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        ResponseMessage.SELFIE_CHECK_SUCCESS,
        selfieMatchDetails,
      );
    } else {
      return new StatusMessagePresenter(
        ResponseStatusCode.SEFLIE_MATCH_FAILURE,
        ResponseMessage.SELFIE_CHECK_FAILURE,
        null,
      );
    }
  }

  @Get('/:customerId/target-api-uuid')
  @ApiTags('Internal Endpoints')
  @ApiParam({ name: 'customerId' })
  @StatusMessageWrapper(
    TargetApiUuidPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.TARGET_API_UUID_SUCCESS,
  )
  async getTargetApiUuid(@Param('customerId') customerId: string) {
    let targetApiUuid: string;
    let status: number;
    let message: string;
    try {
      targetApiUuid = await this.customersService.getTargetApiUuid(customerId);
      if (targetApiUuid) {
        status = ResponseStatusCode.SUCCESS;
        message = ResponseMessage.TARGET_API_UUID_SUCCESS;
      } else {
        status = ResponseStatusCode.FAIL;
        message = ResponseMessage.TARGET_API_UUID_FAIL;
      }
    } catch (err) {
      this.logger.error(err.stack);
      throw err;
    }
    return new StatusMessagePresenter(status, message, { targetApiUuid });
  }

  @Get('/idCardDetails/:customerId/')
  @ApiTags('Internal Endpoints')
  @ApiParam({ name: 'customerId' })
  @StatusMessageWrapper(
    CustIdCardDetails,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.ID_CARD_DETAILS_SUCCESS,
  )
  async getIdCardDetails(@Param('customerId') customerId: string) {
    const idCardDetails: ICustIdCardDetails =
      await this.custIdCardService.getIdCardDetails(customerId);
    if (idCardDetails === null)
      return new StatusMessagePresenter(
        ResponseStatusCode.FAIL,
        ResponseMessage.ID_CARD_DETAILS_FAIL,
        null,
      );
    else
      return new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        ResponseMessage.ID_CARD_DETAILS_SUCCESS,
        idCardDetails,
      );
  }

  @Get('/selfieLiveness/:customerId/')
  @ApiTags('Internal Endpoints')
  @ApiParam({ name: 'customerId' })
  @StatusMessageWrapper(
    CustScanCardSelfieCheckDetails,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.SELFIE_LIVENESS_SUCCESS,
  )
  async getSelfieLiveness(@Param('customerId') customerId) {
    const customerSelfie: ICustScanCardSelfieCheckDetails =
      await this.custIdCardService.getSelfieLiveness(customerId);

    if (customerSelfie === null)
      return new StatusMessagePresenter(
        ResponseStatusCode.FAIL,
        ResponseMessage.SELFIE_LIVENESS_FAIL,
        null,
      );
    else
      return new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        ResponseMessage.SELFIE_LIVENESS_SUCCESS,
        customerSelfie,
      );
  }

  @Get('offerVariant/:offerId')
  @ApiTags('Internal Endpoints')
  @ApiParam({ name: 'offerId' })
  @StatusMessageWrapper(
    OfferConfig,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.OFFER_DETAILS_SUCCESS,
  )
  async getOfferDetails(@Param('offerId') offerId: string) {
    const offerDetails: IOfferConfig =
      await this.studentDetailsService.getStudentOfferDetails(offerId);

    if (offerDetails === null)
      return new StatusMessagePresenter(
        ResponseStatusCode.FAIL,
        ResponseMessage.OFFER_DETAILS_FAILURE,
        null,
      );
    else
      return new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        ResponseMessage.OFFER_DETAILS_SUCCESS,
        offerDetails,
      );
  }

  @Get('studentDetails/:studentPCOId/:custId')
  @ApiTags('Internal Endpoints')
  @ApiParam({ name: 'custId' })
  @ApiParam({ name: 'studentPCOId' })
  @StatusMessageWrapper(
    StudentDetails,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.STUDENT_DETAILS_SUCCESS,
  )
  async getStudentDetails(
    @Param('studentPCOId') studentPCOId: string,
    @Param('custId') custId: string,
  ) {
    const studentDetails: IStudentDetails =
      await this.studentDetailsService.getStudentDetails(studentPCOId, custId);

    if (studentDetails === null)
      return new StatusMessagePresenter(
        ResponseStatusCode.FAIL,
        ResponseMessage.STUDENT_DETAILS_FAIL,
        null,
      );
    else
      return new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        ResponseMessage.STUDENT_DETAILS_SUCCESS,
        studentDetails,
      );
  }

  @Get('/:customerid/msisdn')
  @ApiTags('Internal Endpoints')
  @ApiParam({ name: 'customerId' })
  @StatusMessageWrapper(
    CustomerMsisdnPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.SUCCESS,
  )
  async getCustomerMsisdn(@Param('customerid') customerId: string) {
    const { msisdnCountryCode, msisdn, preferredName, availableCreditLimit } =
      await this.customersService.getMsisdn(customerId);
    const platformApplicationEndpoint =
      await this.pushNotificationService.getEndpointArnFromCustomerOrLeadId(
        IdType.CUSTOMER,
        customerId,
      );
    const status = ResponseStatusCode.SUCCESS;
    const message = ResponseMessage.SUCCESS;
    return new StatusMessagePresenter(status, message, {
      msisdnCountryCode,
      msisdn,
      preferredName,
      platformApplicationEndpoint,
      availableCreditLimit,
    });
  }

  @Post('retry-upload')
  @ApiTags('Loan Application')
  @ApiBodyWithJWTBearerToken({ type: [RetryUploadDTO] })
  @StatusMessageWrapper(
    RetryUploadPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.SUCCESS,
  )
  async retryUpload(
    @User() custId: string,
    @Body() retryUploadDTO: RetryUploadDTO[],
  ) {
    const presenter: RetryUploadPresenter =
      await this.custIdCardService.retryUpload(custId, retryUploadDTO);

    const status = ResponseStatusCode.SUCCESS;
    const message = ResponseMessage.SUCCESS;
    return new StatusMessagePresenter(status, message, presenter);
  }

  @Post('action')
  @UseInterceptors(IpWhitelistingInterceptor)
  @ApiTags('Onboarding')
  @ApiBody({ type: ResumeActionDTO })
  @StatusMessageWrapper(
    TriggerOtpPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.RESUME_ONBOARDING_SUCCESS,
  )
  async resumeAction(@Body() resumeAction: ResumeActionDTO) {
    let status: number;
    let message: string;
    let data: TriggerOtpPresenter;

    if (resumeAction.opId === 1) {
      const triggerOTP: TriggerOtpServiceDto =
        await this.triggerOtpService.resumeAction(
          resumeAction.msisdn,
          resumeAction.msisdnCountryCode,
        );

      if (DedupStatus.DEDUP_NO_MATCH === triggerOTP.dedupStatus) {
        status = 3008;
        message = 'Msisdn not found. Please start the registration process.';
      } else if (DedupStatus.DEDUP_MATCH === triggerOTP.dedupStatus) {
        status = ResponseStatusCode.DEDUPE_MATCH;
        message = ResponseMessage.RESUME_ONBOARDING_DEDUP_MATCH;
      } else {
        status = ResponseStatusCode.SUCCESS;
        message = ResponseMessage.RESUME_ONBOARDING_SUCCESS;
        data = new TriggerOtpPresenter(triggerOTP.lead, null, null);
      }
    } else if (resumeAction.opId === 2) {
      const response = await this.custToLOSService.cancelOnboardingWorkflow(
        resumeAction.msisdnCountryCode,
        resumeAction.msisdn,
      );
      status = response['status'];
      message = response['message'];
    }
    return new StatusMessagePresenter(status, message, data);
  }

  @Get('experian')
  async experian() {
    const dto: KycEnquiryDto = {
      idType: IdType.LEAD,
      idValue: 'lead123',
      nationalIdNumber: 'CM00123BBFFE0Z',
    };
    await this.experianService.kycEnquiry(dto);
    return 'ok';
  }

  @Get('states')
  @ApiTags('Loan Application')
  @ApiBearerAuth('jwt-access-token')
  @StatusMessageWrapper(
    EKycPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.EKYC_SUCCESS,
  )
  async getEKycState(@User() custId: string) {
    const presenter: EKycPresenter = await this.custToLMSService.getEKycState(
      custId,
    );

    const status = ResponseStatusCode.SUCCESS;
    const message = ResponseMessage.EKYC_SUCCESS;
    return new StatusMessagePresenter(status, message, presenter);
  }

  @Get('/fullmsisdn/:fullmsisdn')
  @ApiTags('Internal Endpoints')
  @ApiParam({ name: 'fullmsisdn' })
  @StatusMessageWrapper(
    GetCustomerFromFullMsisdnPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.MATCHING_LEAD_FOUND,
  )
  async getCustFromFullMsisdn(@Param('fullmsisdn') fullMsisdn) {
    const presenter: GetCustomerFromFullMsisdnPresenter =
      await this.customersService.getCustFromFullMsisdn(fullMsisdn);

    let status: number;
    let message: string;
    if (presenter) {
      status = ResponseStatusCode.SUCCESS;
      message = ResponseMessage.MATCHING_LEAD_FOUND;
    } else {
      status = ResponseStatusCode.FAIL;
      message = ResponseMessage.MATCHING_LEAD_NOT_FOUND;
    }
    return new StatusMessagePresenter(status, message, presenter);
  }

  @Get('terminate/loans/:custId')
  @ApiTags('Loan Application')
  @ApiBearerAuth('jwt-access-token')
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: ResponseStatusCode.SUCCESS },
        message: {
          type: 'string',
          example: ResponseMessage.MATCHING_LEAD_FOUND,
        },
        data: { type: 'boolean', example: true },
      },
    },
  })
  async terminateLoans(@Param('custId') custId: string) {
    const resp: boolean = await this.custToLOSService.terminateOngoingLoans(
      custId,
    );
    let status: number;
    let message: string;
    if (resp) {
      status = ResponseStatusCode.SUCCESS;
      message = ResponseMessage.MATCHING_LEAD_FOUND;
    } else {
      status = ResponseStatusCode.FAIL;
      message = ResponseMessage.MATCHING_LEAD_NOT_FOUND;
    }
    return new StatusMessagePresenter(status, message, resp);
  }

  @Post('/otp-trigger-general')
  @ApiTags('General OTP Flow')
  @ApiBody({ type: ForgotPinOtpTriggerDto }) //ToDo Figure out how to document multiple request body types
  @StatusMessageWrapper(
    OTPTriggerGeneralPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.OTP_GENERATED,
  )
  async generalOtpTrigger(@Body() generalOtpTriggerDto: GeneralOtpTriggerDto) {
    this.logger.log(this.generalOtpTrigger.name);
    if (
      //Same payloads for Forgot Pin and New Device Registration
      generalOtpTriggerDto.otpAction === OtpAction.FORGOT_PIN ||
      generalOtpTriggerDto.otpAction === OtpAction.NEW_DEVICE_REGISTRATION
    ) {
      this.logger.log('Forgot Pin or Register New Device');
      let dto;
      if (generalOtpTriggerDto.otpAction === OtpAction.FORGOT_PIN) {
        dto = generalOtpTriggerDto as ForgotPinOtpTriggerDto;
      } else if (
        generalOtpTriggerDto.otpAction === OtpAction.NEW_DEVICE_REGISTRATION
      ) {
        dto = generalOtpTriggerDto as RegisterNewDeviceOtpTriggerDto;
      } else {
        dto = generalOtpTriggerDto;
      }

      const otp: IGeneralOtp =
        await this.forgotPinService.forgotPinOrRegisterNewDevice(dto); //method will return null if no NIN / DOB (is available) / phone number doesn't match
      if (!otp) {
        return new StatusMessagePresenter(
          ResponseStatusCode.FAIL,
          ResponseMessage.NO_CUSTOMER_MATCHING_NIN_DOB_MSISDN,
        );
      }
      const { msisdnCountryCode, msisdn } = dto;
      const otpPrefix = otp.otpValue.split('-')[0];
      return new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        ResponseMessage.OTP_GENERATED,
        { otpPrefix, msisdnCountryCode, msisdn, customerId: otp.customerId },
      );
    }
    //End logic for Forgot Pin
    else {
      this.logger.log(`Invalid Otp Action: ${generalOtpTriggerDto.otpAction}`);
    }
  }

  @Post('/otp-verify-general')
  @ApiTags('General OTP Flow')
  @ApiBody({ type: GeneralOtpVerifyDto })
  @StatusMessageWrapper(
    OtpVerifyGeneralPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.VERIFICATION_SUCCESS,
  )
  async generalOtpVerify(@Body() generalVerifyOtpDto: GeneralOtpVerifyDto) {
    this.logger.log(this.generalOtpVerify.name);
    const isVerified = await this.generalOtpService.verifyOtp(
      generalVerifyOtpDto,
    );
    if (isVerified) {
      const { otpVerifiedKey, customerId } = isVerified;

      //Add Additional payload data
      if (generalVerifyOtpDto.otpAction === OtpAction.NEW_DEVICE_REGISTRATION) {
        const devices = await this.authServiceClient.getDevices(customerId);
        console.log(devices);
        let deviceList: DevicePresenter[];
        if (devices) {
          deviceList = devices.map((device) => {
            return new DevicePresenter(device);
          });
        }
        return new StatusMessagePresenter(
          ResponseStatusCode.SUCCESS,
          ResponseMessage.VERIFICATION_SUCCESS,
          { customerId, otpVerifiedKey, deviceList },
        );
      }
      return new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        ResponseMessage.VERIFICATION_SUCCESS,
        { customerId, otpVerifiedKey },
      );
    } else {
      return new StatusMessagePresenter(
        ResponseStatusCode.VERIFICATION_FAIL,
        ResponseMessage.VERIFICATION_FAIL,
      );
    }
  }

  @Get('profile/personal')
  @ApiTags('Profile and Dashboard')
  @ApiBearerAuth('jwt-access-token')
  @StatusMessageWrapper(
    ProfilePersonalDataPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.PROFILE_PERSONAL,
  )
  async getProfilePersonalData(@User() custId: string) {
    this.logger.log(this.getProfilePersonalData.name);
    const presenter: ProfilePersonalDataPresenter =
      await this.customersService.getProfilePersonalData(custId);

    return new StatusMessagePresenter(
      ResponseStatusCode.SUCCESS,
      ResponseMessage.PROFILE_PERSONAL,
      presenter,
    );
  }

  @Get('profile/address')
  @ApiTags('Profile and Dashboard')
  @ApiBearerAuth('jwt-access-token')
  @StatusMessageWrapper(
    GetAddressResponseDto,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.GET_ADDRESS_SUCCESS,
  )
  async getAddress(@User() customerId: string) {
    this.logger.log(this.getAddress.name);
    try {
      const getAddressResponseDto: GetAddressResponseDto =
        await this.custIdCardService.getAddress(customerId);
      return new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        ResponseMessage.GET_ADDRESS_SUCCESS,
        getAddressResponseDto,
      );
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        return new StatusMessagePresenter(
          ResponseStatusCode.ADDRESS_NOT_AVAILABLE,
          ResponseMessage.ADDRESS_NOT_AVAILABLE,
        );
      }
      throw e;
    }
  }

  @Get('students')
  @ApiTags('Profile and Dashboard')
  @ApiBearerAuth('jwt-access-token')
  @StatusMessageWrapper(
    RetrieveStudentDetailsPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.STUDENT_DETAILS_SUCCESS,
    true,
  )
  async getWhitelistedStudents(@User() custId: string) {
    this.logger.log(this.getWhitelistedStudents.name);
    const presenter: RetrieveStudentDetailsPresenter[] =
      await this.studentDetailsService.getWhiteListedStudent(custId);

    let status: number;
    let message: string;
    if (presenter && presenter.length > 0) {
      status = ResponseStatusCode.SUCCESS;
      message = ResponseMessage.STUDENT_DETAILS_SUCCESS;
    } else {
      status = ResponseStatusCode.RETRIEVE_STUDENT_DETAILS_FAIL;
      message = ResponseMessage.WHITE_LISTED_NO_STUDENT;
    }
    return new StatusMessagePresenter(status, message, presenter);
  }

  @Delete('students/:studentId')
  @ApiTags('Profile and Dashboard')
  @ApiBearerAuth('jwt-access-token')
  @StatusMessageWrapper(
    null,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.WHITELISTED_STUDENT_DELETED,
  )
  async DeleteStudentDetailsDTO(
    @User() custId: string,
    @Param('studentId') studentId: string,
  ) {
    const isDeleted =
      await this.studentDetailsService.deleteWhitelistedStudentDetails(
        custId,
        studentId,
      );
    if (isDeleted) {
      return new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        ResponseMessage.WHITELISTED_STUDENT_DELETED,
        null,
      );
    }
    return new StatusMessagePresenter(
      ResponseStatusCode.WHITELISTED_STUDENT_NOT_DELETED,
      ResponseMessage.WHITELISTED_STUDENT_NOT_DELETED,
      null,
    );
  }

  @Post('students/add')
  @ApiTags('Profile and Dashboard')
  @ApiBodyWithJWTBearerToken({ type: AddStudentDetailsDTO })
  @StatusMessageWrapper(
    null,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.WHITELISTED_STUDENT_ADDED,
  )
  async addWHitelistedStudent(
    @User() custId: string,
    @Body() addStudentDetailsDTO: AddStudentDetailsDTO,
  ) {
    const studentAdded: boolean =
      await this.studentDetailsService.addWhitelistedStudentDetails(
        custId,
        addStudentDetailsDTO,
      );
    if (studentAdded) {
      return new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        ResponseMessage.WHITELISTED_STUDENT_ADDED,
        null,
      );
    } else {
      return new StatusMessagePresenter(
        ResponseStatusCode.VALIDATION_FAIL,
        ResponseMessage.WHITELISTED_STUDENT_ADD_FAILED,
        null,
      );
    }
  }

  @Get('/applyloan')
  @ApiTags('Loan Application')
  @ApiBearerAuth('jwt-access-token')
  @UseInterceptors(IpWhitelistingInterceptor)
  @StatusMessageWrapper(
    null,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.WHITE_LISTED_IP_SUCCESS,
  )
  async applyNowLoans(@User() custId: string) {
    return new StatusMessagePresenter(
      ResponseStatusCode.SUCCESS,
      ResponseMessage.WHITE_LISTED_IP_SUCCESS,
    );
  }

  @Post('support/fsticket')
  @ApiTags('Support Ticket')
  @ApiBearerAuth('jwt-access-token')
  @UseInterceptors(FilesInterceptor('files'))
  @StatusMessageWrapper(
    null,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.SUPPORT_TICKET_SUCCESS,
  )
  async submitTicket(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @User() custId: string,
    @Body() submitTicket: SubmitTicketDTO,
  ) {
    const response = await this.customersService.submitSupportTicket(
      files,
      custId,
      submitTicket,
    );
    if (response === 7001) {
      return new StatusMessagePresenter(
        ResponseStatusCode.SUPPORT_TICKET_EMAIL_ALREADY_PRESENT,
        ResponseMessage.SUPPORT_TICKET_EMAIL_ALREADY_PRESENT,
        null,
      );
    } else if (response === 7002) {
      return new StatusMessagePresenter(
        ResponseStatusCode.SUPPORT_TICKET_FILE_SIZE_EXCEEDED,
        ResponseMessage.SUPPORT_TICKET_FILE_SIZE_EXCEEDED,
        null,
      );
    } else if (response === 2000) {
      return new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        ResponseMessage.SUPPORT_TICKET_SUCCESS,
        null,
      );
    }
  }

  @Get('support/fsticket')
  @ApiTags('Support Ticket')
  @ApiBearerAuth('jwt-access-token')
  @StatusMessageWrapper(
    null,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.SUPPORT_TICKET_LIST_SUCCESS,
  )
  async getAllTickets(@User() custId: string) {
    const presenter: FSResponsePresenter[] =
      await this.customersService.getAllSupportTicketForCustId(custId);
    if (presenter) {
      return new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        ResponseMessage.SUPPORT_TICKET_LIST_SUCCESS,
        presenter,
      );
    } else {
      return new StatusMessagePresenter(
        ResponseStatusCode.SUPPORT_TICKET_LIST_UNAVAIALABLE,
        ResponseMessage.SUPPORT_TICKET_LIST_UNAVAILABLE,
        null,
      );
    }
  }

  @Post('mtn_consent_status')
  @ApiTags('MTN consent')
  @StatusMessageWrapper(
    null,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.MTN_SUCCESS_CONSENT,
  )
  async mtnConsentStatus(@Body() mtnConsentStatusDTO: MTNConsentStatusDTO) {
    const result: boolean = await this.custOTPService.mtnConsentStatus(
      mtnConsentStatusDTO,
    );
    if (result) {
      return new StatusMessagePresenter(
        ResponseStatusCode.SUCCESS,
        ResponseMessage.MTN_SUCCESS_CONSENT,
        null,
      );
    } else {
      return new StatusMessagePresenter(
        ResponseStatusCode.MTN_FAILURE_CONSENT,
        ResponseMessage.MTN_FAILURE_CONSENT,
        null,
      );
    }
  }

  @Post('mtnapproval')
  @ApiTags('MTN consent')
  @StatusMessageWrapper(
    TriggerOtpPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.OTP_GENERATED,
  )
  async mtnApporvalPolling(
    @Body() mtnApprovalPollingDTO: MTNApprovalPollingDTO,
  ) {
    const result: MTNApprovalServiceDTO =
      await this.triggerOtpService.mtnApprovalPolling(mtnApprovalPollingDTO);
    if (result) {
      if (result.custOtp) {
        const triggerOtpPresenter: TriggerOtpPresenter =
          new TriggerOtpPresenter(result.custOtp, null, null);
        return new StatusMessagePresenter(
          ResponseStatusCode.SUCCESS,
          ResponseMessage.OTP_GENERATED,
          triggerOtpPresenter,
        );
      } else if (result.validationFailed) {
        return new StatusMessagePresenter(
          ResponseStatusCode.MTN_APPROVAL_PIN_FAILURE,
          ResponseMessage.MTN_APPROVAL_PIN_FAILURE,
          null,
        );
      } else {
        return new StatusMessagePresenter(
          ResponseStatusCode.MTN_APPROVAL_PIN_NOT_AVAILABLE,
          ResponseMessage.MTN_APPROVAL_PIN_NOT_AVAILABLE,
          null,
        );
      }
    }
    return new StatusMessagePresenter(
      ResponseStatusCode.MTN_APPROVAL_INVALID_INPUT,
      ResponseMessage.MTN_APPROVAL_PINT_INVALID_INPUT,
      null,
    );
  }

  @Post('registertoken')
  @ApiTags('Notification')
  @StatusMessageWrapper(
    null,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.REGISTER_TOKEN_SUCCESS,
  )
  async registerToken(@Body() deviceDetails: DeviceDetailsDTO) {
    await this.pushNotificationService.registerToken(deviceDetails);
    return new StatusMessagePresenter(
      ResponseStatusCode.SUCCESS,
      ResponseMessage.REGISTER_TOKEN_SUCCESS,
      null,
    );
  }

  @Post('update-push-device')
  @UseGuards(InternalAuthGuard) //ToDo change this to @InternalEndpoint() once FUR-9007 is merged into main
  @StatusMessageWrapper(
    null,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.SUCCESS,
  )
  async registerPushNotification(
    @Body() inputDto: RegisterForPushNotificationDto,
  ) {
    const { customerId, deviceId, deviceOs, deviceToken } = inputDto;
    const userDevice =
      await this.pushNotificationService.updateDeviceForGivenCustomerOrLead({
        customerId,
        deviceId,
        deviceOs,
        firebaseToken: deviceToken,
      });
    this.logger.log('Updated / Created User Device:');
    this.logger.log(userDevice);

    return new StatusMessagePresenter(
      ResponseStatusCode.SUCCESS,
      ResponseMessage.SUCCESS,
    );
  }

  @Get('schools')
  @ApiTags('Onboarding')
  @StatusMessageWrapper(
    WhitelistedSchoolPresenter,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.WHITELISTED_SCHOOL_SUCCESS,
  )
  async getWhitelistedSchoolList() {
    const presenter: WhitelistedSchoolPresenter =
      await this.customersService.getWhitelistedSchoolList();
    return new StatusMessagePresenter(
      ResponseStatusCode.SUCCESS,
      ResponseMessage.WHITELISTED_SCHOOL_SUCCESS,
      presenter,
    );
  }

  @Post('opt-out')
  @ApiTags('MTN consent')
  @ApiBearerAuth('jwt-access-token')
  @StatusMessageWrapper(
    null,
    ResponseStatusCode.SUCCESS,
    ResponseMessage.MTN_OPT_OUT_SUCCESS,
  )
  async optOutCustomers(
    @User() custId: string,
    @Body() mtnOptOutDTO: MTNOptOutDTO,
  ) {
    const responseCode: number = await this.customersService.optOutCustomers(
      mtnOptOutDTO,
    );
    let status: number;
    let messgae: string;
    switch (responseCode) {
      case 2000:
        status = ResponseStatusCode.SUCCESS;
        messgae = ResponseMessage.MTN_OPT_OUT_SUCCESS;
        break;

      case 3987:
        status = ResponseStatusCode.MTN_OPT_OUT_NON_MTN;
        messgae = ResponseMessage.MTN_OPT_OUT_NON_MTN;
        break;
      case 3989:
        status = ResponseStatusCode.MTN_OPT_OUT_INVALID_USER;
        messgae = ResponseMessage.MTN_OPT_OUT_INVALID_USER;
        break;

      case 3990:
        status = ResponseStatusCode.MTN_OPT_OUT_NETWORK_FAILURE;
        messgae = ResponseMessage.MTN_OPT_OUT_NETWORK_FAILURE;
        break;

      case 3991:
        status = ResponseStatusCode.MTN_OPT_OUT_PENDING;
        messgae = ResponseMessage.MTN_OPT_OUT_PENDING;
        break;

      case 3992:
        status = ResponseStatusCode.MTN_OPT_OUT_FAILURE;
        messgae = ResponseMessage.MTN_OPT_OUT_FAILURE;
        break;

      case 3993:
        status = ResponseStatusCode.MTN_OPT_OUT_LOANS_PRESENT;
        messgae = ResponseMessage.MTN_OPT_OUT_LOANS_PRESENT;
        break;
    }
    return new StatusMessagePresenter(status, messgae, null);
  }
}
