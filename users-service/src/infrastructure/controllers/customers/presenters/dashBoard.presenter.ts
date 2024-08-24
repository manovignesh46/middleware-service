import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { EligibleVariantDTO } from '../dtos/eligibleVariants.dto';
import { LOSLoan, LoanAgainstDetail } from '../dtos/losLoans.dto';
import { RetrieveStudentDetailsPresenter } from './retrieveStudentDetails.presenter';
import { SubmittedLoansLOS } from '../dtos/losSubmittedLoans.dto';
import moment from 'moment';

export class LoanAgainstDetailMW {
  @ApiProperty()
  studentName: string;

  @ApiProperty()
  paymentGateway: string;

  @ApiProperty()
  studentCode: string;

  @ApiProperty()
  schoolName: string;

  @ApiProperty()
  studentClass: string;

  @ApiProperty()
  schoolCode: string;

  @ApiProperty()
  studentGender: string;

  @ApiProperty()
  studentDob: string;

  @ApiProperty()
  studentPaymentCode: string;

  @ApiProperty()
  studentOva: string;

  @ApiProperty()
  telcoOva: string;
}
export class LoansDetail {
  @ApiProperty()
  loanId: string;

  @ApiProperty()
  loanAmount: number;

  @ApiProperty()
  nextFinancialMilestoneAt: Date;

  @ApiProperty()
  nextEmiDueAmount: number;

  @ApiProperty()
  loanDueDate: Date;

  @ApiProperty()
  loanDate: Date;

  @ApiProperty()
  isLoanOverdue: boolean;

  @ApiProperty()
  overdueMessage: string;

  @ApiProperty()
  emiDueCount: number;

  @ApiProperty()
  amountPaid: number;

  @ApiProperty()
  nextEmiDueDate: Date;

  @ApiProperty()
  emiAmount: number;

  @ApiProperty()
  roi: string;

  @ApiProperty()
  dueDay: string;

  @ApiProperty()
  studentPCOId: string;

  @ApiProperty()
  loanDueAmount: number;

  @ApiProperty()
  totalEMIDueAmount: number;

  @ApiProperty()
  offerId: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  totalPayable: number;

  @ApiProperty()
  loanAgainstDetails: LoanAgainstDetailMW;
}

export class SubmittedLoans {
  @ApiProperty()
  loanId: string;

  @ApiProperty()
  loanAmount: number;

  @ApiProperty()
  creationDate: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  rejectionCode: number;

  @ApiProperty()
  loanAgainstId: string;

  @ApiProperty()
  variantId: number;

  @ApiProperty()
  rejectionReason: string;

  @ApiProperty()
  loanAgainstDetails: LoanAgainstDetailMW;

  @ApiProperty()
  productVariantName: string;

  @ApiProperty()
  studentName: string;

  @ApiProperty()
  studentClass: string;

  @ApiProperty()
  studentRegnNumber: string;

  @ApiProperty()
  schoolName: string;

  @ApiProperty()
  schoolCode: string;
}

export class OfferDetail {
  @ApiProperty()
  offerId: string;

  @ApiProperty()
  offerName: string;

  @ApiProperty()
  offerDescription: string;

  @ApiProperty()
  offerImage: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  moreDetails: any;
}

export class DashBoardPresenter {
  @ApiProperty()
  countryCode: string;

  @ApiProperty()
  msisdn: string;

  @ApiProperty()
  delinquentCustomer: string;

  @ApiProperty()
  creditLimitExpiresOn: string;

  @ApiProperty()
  preferredName: string;

  @ApiProperty()
  lastLoginTime: Date;

  @ApiProperty()
  approvedAmount: number;

  @ApiProperty()
  totalLoanAmount: number;

  @ApiProperty()
  activeLoansAmount: number;

  @ApiProperty()
  closedLoansAmount: number;

  @ApiProperty()
  totalCreditLimit: number;

  @ApiProperty()
  customerId: string;

  @ApiProperty()
  creditScore: number;

  @ApiProperty()
  customerKyc: string;

  @ApiProperty()
  custNIN: string;

  @ApiProperty({ isArray: true, type: LoansDetail })
  activeLoansDetails: LoansDetail[];

  @ApiProperty({ isArray: true, type: LoansDetail })
  closedLoansDetails: LoansDetail[];

  // @ApiProperty({ isArray: true, type: RetrieveStudentDetailsPresenter })
  // studentsDetails: RetrieveStudentDetailsPresenter[];

  @ApiProperty({ isArray: true, type: OfferDetail })
  offersDetails: OfferDetail[];

  @ApiProperty()
  totalLoans: number;

  @ApiProperty()
  totalActiveLoanPayableAmount: number;

  @ApiProperty()
  totalActiveLoanRunningBalance: number;

  @ApiProperty()
  variantsMinAmount: number;

  @ApiProperty()
  mrzNINExpiry: string;

  @ApiProperty()
  telcoWallet: string;

  @ApiProperty()
  pendingCount: number;

  @ApiProperty()
  activeLoansCount: number;

  @ApiProperty({ isArray: true, type: SubmittedLoans })
  submittedLoans: SubmittedLoans[];

  @ApiProperty()
  email: string;
}

export async function getLoansDetails(
  openLoans: LOSLoan[],
): Promise<LoansDetail[]> {
  const loansDetail: LoansDetail[] = [];
  for await (const openLoan of openLoans) {
    const dto: LoansDetail = new LoansDetail();
    dto.loanId = openLoan.id;
    dto.loanAmount = openLoan.loan_amount;
    dto.loanDueDate = openLoan.loan_due_date;
    dto.loanDate = openLoan.creationDate;
    dto.nextEmiDueAmount = openLoan.next_emi_due_amount;
    dto.nextEmiDueDate = openLoan.next_emi_due_date;
    dto.nextFinancialMilestoneAt = openLoan.next_financial_milestone_at;
    dto.emiAmount = openLoan.emi_amount;
    dto.roi = openLoan.interest_rate;
    dto.overdueMessage = openLoan.overdue_message;
    dto.isLoanOverdue = openLoan.is_loan_overdue;
    dto.emiDueCount = openLoan.emi_paid_count;
    dto.amountPaid = openLoan.amount_paid;
    dto.dueDay = openLoan.due_day;
    dto.studentPCOId = openLoan.loan_against_id;
    dto.loanDueAmount = openLoan.total_outstanding;
    dto.totalEMIDueAmount = openLoan.total_emi_amount_due;
    dto.offerId = openLoan.variant_id;
    dto.productName = openLoan.product_name;
    dto.totalPayable = openLoan.total_payable;
    dto.loanAgainstDetails = openLoan.loan_against_details
      ? await getStudentDetails(openLoan.loan_against_details)
      : null;
    loansDetail.push(dto);
  }
  return loansDetail;
}

export async function getSubmittedLoansDetails(
  submittedLoansLOS: SubmittedLoansLOS[],
): Promise<SubmittedLoans[]> {
  const submittedLoans: SubmittedLoans[] = [];
  for await (const submittedLoanLOS of submittedLoansLOS) {
    const submittedLoan: SubmittedLoans = new SubmittedLoans();

    submittedLoan.creationDate = moment(submittedLoanLOS.creationDate).format(
      'DD.MM.YYYY',
    );
    submittedLoan.loanAgainstDetails = submittedLoanLOS.loan_against_details
      ? await getStudentDetails(submittedLoanLOS.loan_against_details)
      : null;
    submittedLoan.loanAgainstId = submittedLoanLOS.loan_against_id;
    submittedLoan.loanAmount = submittedLoanLOS.loanAmount;
    submittedLoan.loanId = submittedLoanLOS.loanId;
    submittedLoan.productName = submittedLoanLOS.productName;
    submittedLoan.productVariantName = submittedLoanLOS.ProductVariantName;
    submittedLoan.rejectionCode = submittedLoanLOS.rejectionCode;
    submittedLoan.rejectionReason = submittedLoanLOS.rejectionReason;
    submittedLoan.schoolCode = submittedLoanLOS.schoolCode;
    submittedLoan.schoolName = submittedLoanLOS.schoolName;
    submittedLoan.status = submittedLoanLOS.status;
    submittedLoan.studentClass = submittedLoanLOS.studentClass;
    submittedLoan.studentName = submittedLoanLOS.studentName;
    submittedLoan.studentRegnNumber = submittedLoanLOS.studentRegnNumber;
    submittedLoan.variantId = submittedLoanLOS.variant_id;
    submittedLoans.push(submittedLoan);
  }
  return submittedLoans;
}
export async function getStudentDetails(
  loanAgainstDetails: LoanAgainstDetail,
): Promise<LoanAgainstDetailMW> {
  const loanAgainstDetailsMW: LoanAgainstDetailMW = new LoanAgainstDetailMW();
  loanAgainstDetailsMW.paymentGateway = loanAgainstDetails.payment_gateway;
  loanAgainstDetailsMW.schoolCode = loanAgainstDetails.school_code;
  loanAgainstDetailsMW.schoolName = loanAgainstDetails.school_name;
  loanAgainstDetailsMW.studentClass = loanAgainstDetails.student_class;
  loanAgainstDetailsMW.studentCode = loanAgainstDetails.student_code;
  loanAgainstDetailsMW.studentDob = loanAgainstDetails.student_dob;
  loanAgainstDetailsMW.studentGender = loanAgainstDetails.student_gender;
  loanAgainstDetailsMW.studentOva = loanAgainstDetails.student_ova;
  loanAgainstDetailsMW.studentPaymentCode =
    loanAgainstDetails.student_paymentcode;
  loanAgainstDetailsMW.telcoOva = loanAgainstDetails.telco_ova;
  loanAgainstDetailsMW.studentName = loanAgainstDetails.student_name;

  return loanAgainstDetailsMW;
}

export async function getOfferDetails(
  eligibleVariants: EligibleVariantDTO[],
): Promise<OfferDetail[]> {
  const offerDetails: OfferDetail[] = [];
  for await (const eligibleVariant of eligibleVariants) {
    const dto: OfferDetail = new OfferDetail();
    dto.offerId = eligibleVariant.product_variant_id.toString();
    dto.offerName = eligibleVariant.product_variant_name;
    dto.offerDescription = eligibleVariant.product_variant_type;
    dto.offerImage = null;
    dto.isActive = 'Active' === eligibleVariant.product_variant_status;
    dto.moreDetails = {
      tenure: eligibleVariant.tenure,
      roi: eligibleVariant.rate_of_interest,
      repaymentFrequency: eligibleVariant.repayment_frequency,
      noOfInstallment: eligibleVariant.no_of_installment,
      limit: eligibleVariant.product_variant_limit,
      applicationfee: eligibleVariant.application_fee_json.application_fee,
    };
    offerDetails.push(dto);
  }

  return offerDetails;
}
