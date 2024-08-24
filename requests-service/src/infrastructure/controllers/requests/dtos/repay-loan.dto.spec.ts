import { validate } from 'class-validator';
import { LoanRepaymentMode } from '../../../../domain/enum/loan-repayment-mode.enum';
import { LoanRepaymentType } from '../../../../domain/enum/loan-repayment-type.enum';
import { RepayLoanDto } from './repay-loan.dto';

const dto = new RepayLoanDto();
dto.offerId = '123';
dto.studentPCOId = '456';
dto.loanAccountNumber = '789';
dto.currentOutstandingAmount = 1000;
dto.paymentMethod = LoanRepaymentMode.AIRTEL_WALLET;
dto.paymentType = LoanRepaymentType.FULL_PAYMENT;
dto.paymentAmount = 500;

describe('RepayLoanDto', () => {
  it('should validate a valid RepayLoanDto instance', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(2);
  });

  it('should return validation errors for an invalid RepayLoanDto instance', async () => {
    const dto = new RepayLoanDto() as any;
    // Set some invalid values here
    dto.offerId = 123; //Number instead of number string
    dto.studentPcoId = 456; //Number instead of number string
    dto.loanAccountNumber = 789; //Number instead of number string
    dto.currentOutstandingAmount = -100; // Not a positive number
    dto.paymentMethod = 'InvalidMethod'; // Not a valid LoanRepaymentMode value
    dto.paymentType = 'InvalidType'; // Not a valid LoanRepaymentType value
    dto.paymentAmount = 0; // Not a positive number

    const errors = await validate(dto);
    expect(errors.length).toEqual(5);
  });
});
