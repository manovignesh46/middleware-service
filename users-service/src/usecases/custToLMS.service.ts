import { Injectable, Logger } from '@nestjs/common';
import { ApplicationStatus } from '../domain/enum/applicationStatus.enum';
import { ICustOtp } from '../domain/model/custOtp.interface';
import { ICustPrimaryDetails } from '../domain/model/custPrimaryDetails.interface';
import { ICustTelco } from '../domain/model/custTelco.interface';
import { ICustToLOS } from '../domain/model/custToLOS.interface';
import { IOfferConfig } from '../domain/model/offerConfig.interface';
import { IdType } from '../domain/model/user-device.interface';
import { ICustOtpRepository } from '../domain/repository/custOtpRepository.interface';
import { ICustPrimaryDetailsRepository } from '../domain/repository/custPrimaryDetailsRepository.interface';
import { ICustToLOSRepository } from '../domain/repository/custToLOSRepository.interface';
import { IOfferConfigRepository } from '../domain/repository/offerConfigRepository.interface';
import { ICustToLMSService } from '../domain/services/custToLMSService.interface';
import { ILMSService } from '../domain/services/lmsService.interface';
import { DashboardResponseDTO } from '../infrastructure/controllers/customers/dtos/dashboardResponse.dto';
import { EligibleVariantDTO } from '../infrastructure/controllers/customers/dtos/eligibleVariants.dto';
import { LMSTelcoResponseDTO } from '../infrastructure/controllers/customers/dtos/lmsTelcoResponse.dto';
import { LOSLoan } from '../infrastructure/controllers/customers/dtos/losLoans.dto';
import { SubmittedLoansLOS } from '../infrastructure/controllers/customers/dtos/losSubmittedLoans.dto';
import {
  DashBoardPresenter,
  getLoansDetails,
  getOfferDetails,
  getSubmittedLoansDetails,
} from '../infrastructure/controllers/customers/presenters/dashBoard.presenter';
import { EKycPresenter } from '../infrastructure/controllers/customers/presenters/ekyc.presenter';
import { CustTelco } from '../infrastructure/entities/custTelco.entity';
import { OfferConfig } from '../infrastructure/entities/offerConfig.entity';
import { parseDate } from './helpers';
import { ClientStatus } from '../domain/enum/clientStatus.enum';
import moment from 'moment';

@Injectable()
export class CustToLMSService implements ICustToLMSService {
  private readonly logger = new Logger(CustToLMSService.name);
  constructor(
    private readonly lmsService: ILMSService,
    private readonly custPrimaryDetailsRepository: ICustPrimaryDetailsRepository,
    private readonly custPrimaryDetailsRepo: ICustPrimaryDetailsRepository,
    private readonly offerConfigRepository: IOfferConfigRepository,
    private readonly custToLosRepository: ICustToLOSRepository,
    private readonly custOtpRepository: ICustOtpRepository,
  ) {}
  async optOutCustomer(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<number> {
    this.logger.log(this.optOutCustomer.name);
    const fullMsisdn: string = msisdnCountryCode + msisdn;
    const response: any = await this.lmsService.optOutCustomer(fullMsisdn);

    const custPrimaryDetails: ICustPrimaryDetails =
      await this.custPrimaryDetailsRepo.findByMsisdn(msisdnCountryCode, msisdn);

    if (response) {
      if (response['code'] === 2000) {
        custPrimaryDetails.clientStatus = ClientStatus.CLOSED;
      } else if (response['code'] === 3991) {
        custPrimaryDetails.clientStatus = ClientStatus.OPTOUT;
      } else if (response['code'] === 3992 || response['code'] === 3993) {
        custPrimaryDetails.clientStatus = ClientStatus.ACTIVE;
      }
      await this.custPrimaryDetailsRepo.updateCustomer(custPrimaryDetails);
      return response['code'];
    }
    return null;
  }

  async purgeCustomer(msisdnList: string[]): Promise<string[]> {
    const response: any = await this.lmsService.purgeCustomer(msisdnList);
    if (response['status'] === 'success' && response['code'] === 2000) {
      return [];
    } else {
      return response['message']['not_purged_msisdns'];
    }
  }

  async getTelcoData(msisdnCountryCode: string, msisdn): Promise<ICustTelco> {
    const fullMsisdn = msisdnCountryCode + msisdn;
    const response: any = await this.lmsService.getCustomerTelco(fullMsisdn);
    if (response['status'] === 'success' && response['code'] === 2000) {
      const responseData: LMSTelcoResponseDTO = response.data;
      const custTelco: ICustTelco = new CustTelco();
      custTelco.firstName = responseData.firstName;
      custTelco.lastName = responseData.lastName;
      custTelco.dob = responseData.dob;
      custTelco.idType = IdType.LEAD;
      custTelco.nationalIdNumber = responseData.idNumber;
      custTelco.msisdnCountryCode = msisdnCountryCode;
      custTelco.msisdn = msisdn;
      custTelco.idExpiry = parseDate(responseData.idExpiry)?.toDate(); //format is 2025-02-24
      return custTelco;
    }
    return null;
  }

  async getDashboardDetails(
    custPrimaryDetails: ICustPrimaryDetails,
  ): Promise<DashboardResponseDTO> {
    const fullMsisdn =
      custPrimaryDetails.msisdnCountryCode + custPrimaryDetails.msisdn;
    const responseData: any = await this.lmsService.dashboard(
      'Installment',
      fullMsisdn,
    );

    const custOtp: ICustOtp = await this.custOtpRepository.getById(
      custPrimaryDetails.leadId,
    );

    const custToLos: ICustToLOS = {
      leadId: custPrimaryDetails.leadId,
      dataToCRM: fullMsisdn,
      respFromCRM: responseData,
      applicationStatus: ApplicationStatus.DASHBOARD_DETAILS,
    } as any as ICustToLOS;
    this.custToLosRepository.createUpdate(custToLos);

    const totalLoans: number = responseData['total_loans'];

    this.logger.log('new code for dashboard is up in user service');
    this.logger.log(
      'Available credit limti ' + responseData['available_credit_limit'],
    );

    custPrimaryDetails.totalLoans = totalLoans;
    custPrimaryDetails.creditExpiryTime =
      responseData['credit_limit_expires_on'];
    custPrimaryDetails.availableCreditLimit =
      responseData['available_credit_limit'];
    this.logger.log(
      ' before update custPRimatDetails :  ' + custPrimaryDetails,
    );
    custPrimaryDetails = await this.custPrimaryDetailsRepository.updateCustomer(
      custPrimaryDetails,
    );

    this.logger.log(' After update custPRimatDetails :  ' + custPrimaryDetails);

    const openLoans: LOSLoan[] = responseData['open_loans'];
    const closedLoans: LOSLoan[] = responseData['closed_loans'];
    const submittedLoans: SubmittedLoansLOS[] = responseData['submittedLoans'];
    const eligibleVariants: EligibleVariantDTO[] =
      responseData['eligible_variants'];

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
        offerConfig.offerLimit = parseFloat(
          eligibleVariant.product_variant_limit.toString(),
        );
        offerConfig.applicationFee =
          eligibleVariant.application_fee_json.application_fee;
        await this.offerConfigRepository.save(offerConfig);
      }
    }

    const presenter: DashBoardPresenter = new DashBoardPresenter();
    presenter.totalLoanAmount = responseData['total_loan_amount'];
    presenter.activeLoansAmount = responseData['total_open_loan_amount'];
    presenter.closedLoansAmount = responseData['total_closed_loan_amount'];
    presenter.approvedAmount = responseData['available_credit_limit'];
    presenter.delinquentCustomer = responseData['delinquent_customer'];
    presenter.customerId = responseData['customer_id'];
    presenter.creditScore = responseData['credit_score'];
    presenter.creditLimitExpiresOn = responseData['credit_limit_expires_on'];
    presenter.totalLoans = totalLoans;
    presenter.totalActiveLoanPayableAmount =
      responseData['total_payable_amount'];
    presenter.totalActiveLoanRunningBalance =
      responseData['total_running_balance'];
    presenter.totalCreditLimit = responseData['total_credit_limit'];
    presenter.customerKyc = responseData['customer_kyc'];
    presenter.variantsMinAmount = responseData['variants_min_amount'];
    presenter.mrzNINExpiry = moment(responseData['mrzNINExpiry']).format(
      'DD.MM.YYYY',
    );
    presenter.offersDetails = await getOfferDetails(eligibleVariants);
    presenter.activeLoansDetails = await getLoansDetails(openLoans);
    presenter.closedLoansDetails = await getLoansDetails(closedLoans);
    presenter.pendingCount = responseData['pendingCount'];
    presenter.activeLoansCount = responseData['active_loans'];
    presenter.submittedLoans = await getSubmittedLoansDetails(submittedLoans);
    presenter.telcoWallet = custOtp.telcoWallet;
    presenter.email = custPrimaryDetails.email;

    const dashboardResponse: DashboardResponseDTO = new DashboardResponseDTO();
    dashboardResponse.dashBoardPresenter = presenter;
    dashboardResponse.applicationStatus = responseData['application_status'];
    dashboardResponse.rejectionReason = responseData['rejection_reason'];
    dashboardResponse.rejectionCode = responseData['rejection_code'];

    return dashboardResponse;
  }

  async getEKycState(custId: string): Promise<EKycPresenter> {
    const custPrimaryDetails: ICustPrimaryDetails =
      await this.custPrimaryDetailsRepo.getByCustomerId(custId);
    const fullMsisdn =
      custPrimaryDetails.msisdnCountryCode + custPrimaryDetails.msisdn;
    const response = await this.lmsService.getEKycState(fullMsisdn);

    const custToLos: ICustToLOS = {
      leadId: custPrimaryDetails.leadId,
      applicationStatus: ApplicationStatus.EKYC_STATE,
      dataToCRM: fullMsisdn,
      respFromCRM: response,
    } as any as ICustToLOS;
    this.custToLosRepository.createUpdate(custToLos);
    return response;
  }
}
