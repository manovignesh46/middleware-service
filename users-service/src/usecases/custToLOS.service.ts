import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import moment from 'moment';
import { ApplicationStatus } from '../domain/enum/applicationStatus.enum';
import { LeadStatus } from '../domain/enum/leadStatus.enum';
import { LOSStatus } from '../domain/enum/losStatus.enum';
import { MatchStatus } from '../domain/enum/matchStatus.enum';
import { ICustOtp } from '../domain/model/custOtp.interface';
import { ICustPrimaryDetails } from '../domain/model/custPrimaryDetails.interface';
import { ICustRefinitiv } from '../domain/model/custRefinitiv.interface';
import { ICustTelco } from '../domain/model/custTelco.interface';
import { ICustToLOS } from '../domain/model/custToLOS.interface';
import { IOfferConfig } from '../domain/model/offerConfig.interface';
import { IStudentDetails } from '../domain/model/studentDetails.interface';
import { IWhitelistedStudentDetails } from '../domain/model/whitelistedStudentDetails.interface';
import { ICustOtpRepository } from '../domain/repository/custOtpRepository.interface';
import { ICustPrimaryDetailsRepository } from '../domain/repository/custPrimaryDetailsRepository.interface';
import { ICustToLOSRepository } from '../domain/repository/custToLOSRepository.interface';
import { IOfferConfigRepository } from '../domain/repository/offerConfigRepository.interface';
import { IWhitelistedStudentDetailsRepository } from '../domain/repository/whitelistedStudentDetailsRepository.interface';
import { ICustRefinitivService } from '../domain/services/custRefinitivService.interface';
import { ICustTelcoService } from '../domain/services/custTelcoService.interface';
import { ICustToLOSService } from '../domain/services/custToLOSService.interface';
import { ILOSService } from '../domain/services/losService.interface';
import { IRequestServiceClient } from '../domain/services/requestServiceClient.service';
import { EligibleVariantDTO } from '../infrastructure/controllers/customers/dtos/eligibleVariants.dto';
import { LOSLoan } from '../infrastructure/controllers/customers/dtos/losLoans.dto';
import {
  LOSOutcomeDTO,
  LeadCreateDTO,
  LeadEnhancedDTO,
  LeadScoringData,
  LeadVerifiedDTO,
  MTNLeadEnhancedDTO,
  MTNLeadVerifiedDTO,
  Outstanding,
  PineCreationDTO,
  RefinitivScreening,
  TelcoTransactionsDetails,
  TelocKycData,
  UpdateStudentDetailsDTO,
} from '../infrastructure/controllers/customers/dtos/losOutcome.dto';
import { RunWorkFlowDTO } from '../infrastructure/controllers/customers/dtos/runApiLOSOutcome.dto';
import { TelcoTransactionResp } from '../infrastructure/controllers/customers/dtos/telcoTransactionResp.dto';
import { ConfirmStudentDetailsPresenter } from '../infrastructure/controllers/customers/presenters/confirmStudentDetails.presenter';
import {
  DashBoardPresenter,
  getLoansDetails,
  getOfferDetails,
} from '../infrastructure/controllers/customers/presenters/dashBoard.presenter';
import { CustScoringData } from '../infrastructure/entities/custScoringData.entity';
import { CustToLOS } from '../infrastructure/entities/custToLOS.entity';
import { OfferConfig } from '../infrastructure/entities/offerConfig.entity';
import { TelcoOpType } from '../domain/enum/telcoOp.enum';
import { OvaProvider } from '../domain/enum/ova-provider.enum';

@Injectable()
export class CustToLOSService implements ICustToLOSService {
  private readonly logger = new Logger(CustToLOSService.name);
  private LOS_PARTNER_CODE = this.configService.get<string>('LOS_PARTNER_CODE');
  private SP_OVA_MAPPING: { ovaName: string; mappedMsisdn: string }[];

  constructor(
    private readonly custToLOSRepository: ICustToLOSRepository,
    private readonly losService: ILOSService,
    private readonly custOtpRepository: ICustOtpRepository,
    private readonly custTelcoService: ICustTelcoService,
    private readonly offerConfigRepository: IOfferConfigRepository,
    private readonly configService: ConfigService,
    private readonly custRefinitveService: ICustRefinitivService,
    private readonly requestServiceClient: IRequestServiceClient,
    private readonly custPrimaryDetailsRepo: ICustPrimaryDetailsRepository,
    private readonly whitelistedStudentDetailsRepo: IWhitelistedStudentDetailsRepository,
  ) {
    const ovaMappingString =
      configService.get('SP_OVA_MAPPING') ||
      '[{"ovaName": "ABSAFEES.sp1", "mappedMsisdn": "256999999999"}]';
    try {
      this.SP_OVA_MAPPING = JSON.parse(ovaMappingString);
    } catch (e) {
      this.logger.error(e);
      this.SP_OVA_MAPPING = [];
    }
  }

  async checkForRejection(leadId: string): Promise<any> {
    const custOTP: ICustOtp = await this.custOtpRepository.getById(leadId);
    if (custOTP !== null) {
      const losResponseData: any = await this.losService.interactionTarget(
        custOTP.targetApiUUID,
      );

      const secondaryUUID: string = losResponseData['actions'][0]['uuid'];
      const applicationStatus: string =
        losResponseData['actions'][0]['payload']['application_status'];
      if (applicationStatus === 'Rejected') {
        return losResponseData['actions'][0]['payload']['rejection_reason'];
      }
    }
    return null;
  }

  async terminateOngoingLoans(
    custId: string,
    reason?: string,
  ): Promise<boolean> {
    const custPrimaryDetails: ICustPrimaryDetails =
      await this.custPrimaryDetailsRepo.getByCustomerId(custId);

    const fullMsisdn =
      custPrimaryDetails.msisdnCountryCode + custPrimaryDetails.msisdn;
    return await this.losService.cancelWorkflow(fullMsisdn, reason);
  }

  async cancelOnboardingWorkflow(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<any> {
    this.logger.log(this.cancelOnboardingWorkflow.name);
    let custOTP: ICustOtp;
    try {
      custOTP = await this.custOtpRepository.getByMsisdn(
        msisdnCountryCode,
        msisdn,
      );
    } catch (error) {
      return {
        status: 3008,
        message:
          'Unable to verify the given phone number. Please enter a different phone number',
      };
    }

    const validStatus: string[] = [
      'OTP_GENERATED',
      'OTP_VERIFIED',
      'LEAD_CREATED',
      'LEAD_VERIFIED',
      'LEAD_ENHANCED',
    ];
    const fullMsisdn = msisdnCountryCode + msisdn;
    const responseData: boolean = await this.losService.cancelWorkflow(
      fullMsisdn,
    );
    if (validStatus.includes(custOTP.leadCurrentStatus)) {
      if (responseData) {
        custOTP.isTerminated = true;
        await this.custOtpRepository.update(custOTP);
        return {
          status: 2000,
          message: 'Onboarding is successfully terminated.',
        };
      }
    }
    return {
      status: 3000,
      message:
        'Onboarding cannot be cancelled as it is present in an invalid state',
    };
  }

  async cancelLoanWorkflow(
    custId: string,
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<any> {
    const fullMsisdn = msisdnCountryCode + msisdn;
    const responseData: boolean = await this.losService.cancelWorkflow(
      fullMsisdn,
    );
    if (responseData) {
      const response = this.requestServiceClient.cancelExistingWorkflow(custId);
      if (response) {
        return {
          status: 2000,
          message: 'Onboarding is successfully terminated.',
        };
      }
    }
  }

  async updateStudentDetails(
    leadId: string,
    studentDetails: IStudentDetails,
    schoolAggregatoreName: string,
    computedAmount: string,
  ): Promise<ConfirmStudentDetailsPresenter> {
    const custOTP: ICustOtp = await this.custOtpRepository.getById(leadId);
    if (custOTP !== null) {
      const losResponseData: any = await this.losService.interactionTarget(
        custOTP.targetApiUUID,
      );

      const secondaryUUID: string = losResponseData['actions'][0]['uuid'];
      const nextAction: string = losResponseData['actions'][0]['action'];

      const outstanding: Outstanding = {
        Amount: studentDetails.isComputedAmount
          ? computedAmount
          : studentDetails.currentSchoolFees.toString(),
        // TODO need to check the elements
        Date: moment().format('DD/MM/YYYY'),
        billername: studentDetails.schoolName,
        minimum_payment_percent: '0',
        minimum_payment_amount: '5000',
        is_computed_amount: studentDetails.isComputedAmount,
      };

      //To parse the correct request format to LOS MTN_UG / AIRTEL_UG
      let telcoOva: 'AIRTEL_UG' | 'MTN_UG';
      let inputOva: string;
      switch (studentDetails.ovaProvider) {
        case OvaProvider.MTN:
          telcoOva = 'MTN_UG';
          inputOva =
            this.SP_OVA_MAPPING.find(
              (ovaMapping) =>
                ovaMapping.ovaName?.trim()?.toLowerCase() ==
                studentDetails.studentOva?.trim()?.toLowerCase(),
            )?.mappedMsisdn || studentDetails.studentOva;
          break;
        case OvaProvider.AIRTEL:
          telcoOva = 'AIRTEL_UG';
          inputOva = studentDetails.studentOva;
        default:
          break;
      }

      const updateStudentDetailsDTO: UpdateStudentDetailsDTO = {
        student_name: studentDetails.studentFullName,
        payment_gateway: schoolAggregatoreName,
        student_code: studentDetails.studentSchoolRegnNumber,
        school_name: studentDetails.schoolName,
        student_class: studentDetails.studentClass,
        student_gender: studentDetails.studentGender,
        outstanding: [outstanding],
        school_code: studentDetails.studentSchoolCode,
        student_dob:
          studentDetails.studentDob !== null
            ? moment(studentDetails.studentDob).format('DD/MM/YYYY')
            : null,
        student_paymentcode: studentDetails.studentPaymentCode,
        student_ova: inputOva,
        telco_ova: telcoOva,
      };

      if (
        nextAction.toLowerCase() ===
        LOSStatus.CONFIRM_STUDENT_DETAILS.toLowerCase()
      ) {
        let custToLOS: ICustToLOS = new CustToLOS(
          leadId,
          custOTP.leadCurrentStatus,
          ApplicationStatus.CONFIRM_STUDENT_DETAILS,
          secondaryUUID,
          JSON.stringify(updateStudentDetailsDTO),
        );
        custToLOS = await this.custToLOSRepository.createUpdate(custToLOS);

        const outcome = await this.losService.interactionOutcome(
          secondaryUUID,
          updateStudentDetailsDTO,
        );

        const losRespAfterUpdateStudentDetails: any =
          await this.losService.interactionTarget(custOTP.targetApiUUID);

        // TODO need to check the elements

        const minLoanAmount: string =
          losRespAfterUpdateStudentDetails['actions'][0]['payload'][
            'minimum_loan_amount'
          ];
        const maxLoanAmount: string =
          losRespAfterUpdateStudentDetails['actions'][0]['payload'][
            'loan_boundary'
          ];

        const studentPCOId: string =
          losRespAfterUpdateStudentDetails['actions'][0]['payload'][
            'student_kyc_id'
          ];

        const presenter: ConfirmStudentDetailsPresenter =
          new ConfirmStudentDetailsPresenter();
        presenter.maxLoanAmount = parseFloat(maxLoanAmount);
        presenter.minLoanAmount = parseFloat(minLoanAmount);
        presenter.studentPCOId = studentPCOId;

        return presenter;
      } else {
        this.logger.error(
          `Workflow step is not at ${LOSStatus.CONFIRM_STUDENT_DETAILS}`,
        );
      }
    }
    return null;
  }

  async dashBoardDetails(targetApiUUID: string): Promise<DashBoardPresenter> {
    const losResponseData: any = await this.losService.interactionTarget(
      targetApiUUID,
    );

    const dashBoardDetails: DashBoardPresenter = new DashBoardPresenter();

    const eligibleVariants: EligibleVariantDTO[] =
      losResponseData['actions'][0]['payload']['eligible_variants'];
    let openLoans: LOSLoan[] = [];

    try {
      openLoans =
        losResponseData['actions'][0]['payload']['data']['open_loans'];
    } catch (error) {
      this.logger.log('open loans is missing in the los response');
    }

    dashBoardDetails.activeLoansDetails = await getLoansDetails(openLoans);
    dashBoardDetails.offersDetails = await getOfferDetails(eligibleVariants);

    for await (const eligibleVariant of eligibleVariants) {
      let offerConfig: IOfferConfig =
        await this.offerConfigRepository.findOfferId(
          eligibleVariant.product_variant_id,
        );
      if (offerConfig === null) {
        offerConfig = new OfferConfig();
        offerConfig.offerId = eligibleVariant.product_variant_id;
        offerConfig.offerName = eligibleVariant.product_variant_name;
        offerConfig.offerDescription = eligibleVariant.product_variant_type;
        offerConfig.offerImage = null;
        offerConfig.offerProvider = null;
        offerConfig.activeStatus = eligibleVariant.product_variant_status;
        offerConfig.tenure = eligibleVariant.tenure;
        offerConfig.roi = eligibleVariant.rate_of_interest;
        offerConfig.noOfInstallment = eligibleVariant.no_of_installment;
        offerConfig.repaymentFrequency = eligibleVariant.repayment_frequency;
        offerConfig.offerLimit = eligibleVariant.product_variant_limit;
        offerConfig.applicationFee =
          eligibleVariant.application_fee_json.application_fee;
        await this.offerConfigRepository.save(offerConfig);
      }
    }

    dashBoardDetails.approvedAmount =
      losResponseData['actions'][0]['payload']['total_credit_limit'];
    dashBoardDetails.activeLoansAmount =
      dashBoardDetails.approvedAmount -
      losResponseData['actions'][0]['payload']['available_credit_limit'];

    return dashBoardDetails;
  }

  async createRepeatWorkflow(leadId: string, fullMsisdn: string): Promise<any> {
    let custOtp: ICustOtp = await this.custOtpRepository.getById(leadId);

    const runWorkflowDTO: RunWorkFlowDTO = {
      msisdn: fullMsisdn,
      partner_code: this.LOS_PARTNER_CODE,
      product_type: 'Installment',
      workflow_name: 'Furaha - Loan Application Flow',
    };

    const runWorkflowRespFromCRM = await this.losService.runWorkFlow(
      runWorkflowDTO,
    );

    this.logger.log(
      'Customer creation response from CRM ',
      runWorkflowRespFromCRM,
    );

    const primaryUUID: string = runWorkflowRespFromCRM['uuid'];
    const secondaryUUID: string = runWorkflowRespFromCRM['actions'][0]['uuid'];

    this.logger.log(`primaryUUID ${primaryUUID}`);
    this.logger.log(`secondaryUUID ${secondaryUUID}`);

    custOtp.targetApiUUID = primaryUUID;
    custOtp.outcomeApiUUID = secondaryUUID;
    custOtp.updatedAt = new Date();
    custOtp = await this.custOtpRepository.update(custOtp);
  }

  async leadCreationInLOS(
    leadId: string,
    leadCurrentStatus: LeadStatus,
  ): Promise<any> {
    this.logger.log(this.leadCreationInLOS.name);

    let custOtp: ICustOtp = await this.custOtpRepository.getById(leadId);
    const fullMsisdn = custOtp.msisdnCountryCode + custOtp.msisdn;

    const runWorkflowDTO: RunWorkFlowDTO = {
      msisdn: fullMsisdn,
      partner_code: this.LOS_PARTNER_CODE,
      product_type: 'Installment',
      workflow_name: 'Furaha - Onboarding Workflow',
    };

    let custToLOS: ICustToLOS = new CustToLOS(
      leadId,
      leadCurrentStatus,
      ApplicationStatus.RUN_INITIATED,
      null,
      JSON.stringify(runWorkflowDTO),
    );
    custToLOS = await this.custToLOSRepository.createUpdate(custToLOS);

    const runWorkflowRespFromCRM = await this.losService.runWorkFlow(
      runWorkflowDTO,
    );

    this.logger.log(
      'Customer creation response from CRM ',
      runWorkflowRespFromCRM,
    );

    const primaryUUID: string = runWorkflowRespFromCRM['uuid'];
    const secondaryUUID: string = runWorkflowRespFromCRM['actions'][0]['uuid'];
    const nextAction: string = runWorkflowRespFromCRM['actions'][0]['action'];

    this.logger.log(`primaryUUID ${primaryUUID}`);
    this.logger.log(`secondaryUUID ${secondaryUUID}`);

    // save uuuid and response
    custOtp.targetApiUUID = primaryUUID;
    custOtp.outcomeApiUUID = secondaryUUID;
    custOtp.updatedAt = new Date();
    custOtp = await this.custOtpRepository.update(custOtp);

    custToLOS.respFromCRM = JSON.stringify(runWorkflowRespFromCRM);
    custToLOS = await this.custToLOSRepository.createUpdate(custToLOS);

    const whitelistedStudentDetails: IWhitelistedStudentDetails[] =
      await this.whitelistedStudentDetailsRepo.findAllStudentsByLeadId(leadId);

    let term1Fee = 0;
    let term2Fee = 0;
    let term3Fee = 0;
    let totalTermsFee = 0;
    let lastPaymentAmount = 0;
    let lastPaymentDate = '';
    for await (const whitelisted of whitelistedStudentDetails) {
      term1Fee = term1Fee + whitelisted.term1Fee;
      term2Fee = term2Fee + whitelisted.term2Fee;
      term3Fee = term3Fee + whitelisted.term3Fee;
      totalTermsFee = totalTermsFee + whitelisted.totalTermsFee;
      lastPaymentAmount = lastPaymentAmount + whitelisted.lastPaymentAmount;
      lastPaymentDate = whitelisted.lastPaymentDate;
    }
    // outcome lead created
    const outcomeDTO: LeadCreateDTO = {
      lead_id: custOtp.leadId,
      name: custOtp.preferredName,
      NIN: custOtp.nationalIdNumber,
      email: custOtp.email,
      lead_status: 'created',
      whitelisted: JSON.parse(custOtp.whitelistedJSON),
      term_1_total_fee: term1Fee,
      term_2_total_fee: term2Fee,
      term_3_total_fee: term3Fee,
      all_terms_total_fee: totalTermsFee,
      last_payment_amount: lastPaymentAmount,
      last_payment_date: lastPaymentDate,
      telco_op: custOtp.telcoOp,
      whitelist_criteria: custOtp.whitelistCriteria,
    };

    custToLOS = new CustToLOS(
      leadId,
      leadCurrentStatus,
      ApplicationStatus.LEAD_CREATED,
      secondaryUUID,
      JSON.stringify(runWorkflowDTO),
    );
    custToLOS = await this.custToLOSRepository.createUpdate(custToLOS);

    let outcomeRespFromCRM = null;
    if (nextAction.toLowerCase() === LOSStatus.LEAD_CREATION.toLowerCase()) {
      outcomeRespFromCRM = await this.losService.interactionOutcome(
        custOtp.outcomeApiUUID,
        outcomeDTO,
      );
    }

    return outcomeRespFromCRM;
  }

  async leadVerifiedInLOS(leadId: string): Promise<any> {
    const custOtp: ICustOtp = await this.custOtpRepository.getById(leadId);

    if (custOtp !== null) {
      const losResponseData: any = await this.losService.interactionTarget(
        custOtp.targetApiUUID,
      );
      const secondaryUUID: string = losResponseData['actions'][0]['uuid'];
      const nextAction: string = losResponseData['actions'][0]['action'];

      this.logger.log('secondary UUID :' + secondaryUUID);

      const custTelco: ICustTelco = await this.custTelcoService.findCustTelco(
        leadId,
      );

      const custRefinitive: ICustRefinitiv =
        await this.custRefinitveService.findCustRefinitiv(leadId);
      const refinitiv_screening: RefinitivScreening = {
        match:
          MatchStatus.MATCHED === custRefinitive.sanctionStatus
            ? 'TRUE'
            : 'FALSE',
      };

      const telcoOperatorCheck: boolean =
        this.configService.get<string>('TELCO-OPERATOR-CHECK') === 'true';
      let outcomeVerifiedDTO: LOSOutcomeDTO = null;

      if (telcoOperatorCheck && custOtp.telcoOp === TelcoOpType.MTN_UG) {
        const mtnLeadVerifiedDTO: MTNLeadVerifiedDTO = {
          lead_id: leadId,
          lead_status: 'verified',
          kyc_status:
            custTelco.ninComparison === MatchStatus.MATCHED ? true : false,
          kyc_status_reason:
            custTelco.ninComparison === MatchStatus.MATCHED
              ? 'National Id matched'
              : 'National Id mismatched',
          refinitiv_screening: refinitiv_screening,
        };
        outcomeVerifiedDTO = mtnLeadVerifiedDTO;
      } else {
        const fullMsisdn = custOtp.msisdnCountryCode + custOtp.msisdn;
        const telco_kyc_data: TelocKycData = {
          telco_name: 'Airtel Uganda',
          first_name: custTelco.firstName,
          last_name: custTelco.lastName,
          msisdn: fullMsisdn,
          national_id: custTelco.nationalIdNumber,
          given_name: custTelco.givenName,
          dob: custTelco.dob,
          gender: custTelco.gender,
          registration_date: custTelco.registrationDate,
          nationality: custTelco.nationality,
        };
        const leadVerifiedDTO: LeadVerifiedDTO = {
          lead_id: leadId,
          lead_status: 'verified',
          kyc_status:
            custTelco.ninComparison === MatchStatus.MATCHED ? true : false,
          kyc_status_reason:
            custTelco.ninComparison === MatchStatus.MATCHED
              ? 'National Id matched'
              : 'National Id mismatched',

          telco_kyc_data: telco_kyc_data,
          refinitiv_screening: refinitiv_screening,
        };
        outcomeVerifiedDTO = leadVerifiedDTO;
      }

      let custToLOS: ICustToLOS = new CustToLOS(
        leadId,
        custOtp.leadCurrentStatus,
        ApplicationStatus.LEAD_VERIFIED,
        secondaryUUID,
        JSON.stringify(outcomeVerifiedDTO),
      );
      custToLOS = await this.custToLOSRepository.createUpdate(custToLOS);

      if (nextAction.toLowerCase() === LOSStatus.LEAD_VERIFIED.toLowerCase()) {
        return await this.losService.interactionOutcome(
          secondaryUUID,
          outcomeVerifiedDTO,
        );
      }
    }
    return false;
  }

  async leadEnhancedInLOS(
    leadId: string,
    custScoringData: CustScoringData,
    experianData: string,
    telcoTransactionResp: TelcoTransactionResp,
  ): Promise<any> {
    const custOtp: ICustOtp = await this.custOtpRepository.getById(leadId);

    if (custOtp !== null) {
      const losResponseData: string = await this.losService.interactionTarget(
        custOtp.targetApiUUID,
      );
      const secondaryUUID: string = losResponseData['actions'][0]['uuid'];
      const nextAction: string = losResponseData['actions'][0]['action'];

      let telcoTrans: TelcoTransactionsDetails = null;
      const leadScoringData: LeadScoringData = {
        active_bank_account: custScoringData.activeBankAccount,
        monthly_gross_income: custScoringData.monthlyGrossIncome,
        years_in_current_place: custScoringData.yearsInCurrentPlace,
        number_of_school_kids: custScoringData.numberOfSchoolKids,
        employment_type: custScoringData.employmentNature,
        marital_status: custScoringData.maritalStatus,
      };

      const fullMsisdn = custOtp.msisdnCountryCode + custOtp.msisdn;
      const telcoOperatorCheck: boolean =
        this.configService.get<string>('TELCO-OPERATOR-CHECK') === 'true';
      let outComeLeadEnch: LOSOutcomeDTO = null;
      if (telcoOperatorCheck && custOtp.telcoOp === TelcoOpType.MTN_UG) {
        const mtnLeadEnhancedDTO: MTNLeadEnhancedDTO = {
          lead_id: leadId,
          lead_status: 'enhanced',
          lead_scoring_data: leadScoringData,
          experian_details: experianData,
        };
        outComeLeadEnch = mtnLeadEnhancedDTO;
      } else {
        if (telcoTransactionResp) {
          telcoTrans = {
            msisdn: fullMsisdn,
            wallet_risk_score: telcoTransactionResp.wallet_risk_score,
            loan_risk_score: telcoTransactionResp.loan_risk_score,
            churn_decile: telcoTransactionResp.churn_decile,
            spend_quartile: telcoTransactionResp.spend_quartile,
            of_last_30d: telcoTransactionResp.of_last_30d,
          };
        }

        const leadEnhancedDTO: LeadEnhancedDTO = {
          lead_id: leadId,
          lead_status: 'enhanced',
          lead_scoring_data: leadScoringData,
          experian_details: experianData,
          telco_transactions_details: telcoTrans,
        };
        outComeLeadEnch = leadEnhancedDTO;
      }

      let custToLOS: ICustToLOS = new CustToLOS(
        leadId,
        custOtp.leadCurrentStatus,
        ApplicationStatus.LEAD_ENHANCED,
        secondaryUUID,
        JSON.stringify(outComeLeadEnch),
      );
      custToLOS = await this.custToLOSRepository.createUpdate(custToLOS);

      if (nextAction.toLowerCase() === LOSStatus.LEAD_ENHANCED.toLowerCase()) {
        return await this.losService.interactionOutcome(
          secondaryUUID,
          outComeLeadEnch,
        );
      }
    }
    return false;
  }

  async pinCreationInLOS(leadId: string, pinCreated: boolean): Promise<any> {
    const custOtp: ICustOtp = await this.custOtpRepository.getById(leadId);

    if (custOtp !== null) {
      const losResponseData: string = await this.losService.interactionTarget(
        custOtp.targetApiUUID,
      );
      const secondaryUUID: string = losResponseData['actions'][0]['uuid'];
      // const nextAction: string = losResponseData['actions'][0]['action'];

      const pinCreationDTO: PineCreationDTO = {
        pin_created: pinCreated,
      };

      return await this.losService.interactionOutcome(
        secondaryUUID,
        pinCreationDTO,
      );
    }
    return false;
  }

  async getCustomerLoansFromLOS(
    custId: string,
    custloanStatus: boolean,
    offset: number,
    limit: number,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    const dataToCRM = {
      custId,
      custloanStatus,
      offset,
      limit,
      startDate,
      endDate,
    };

    const respFromCRM = await this.losService.getCustomerLoans(dataToCRM);

    this.logger.log('Get Customer Loan from CRM', respFromCRM);

    return respFromCRM;
  }
}
