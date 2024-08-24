import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustLoanRecordTypesStandardize1685034639732
  implements MigrationInterface
{
  name = 'CustLoanRecordTypesStandardize1685034639732';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ALTER COLUMN "loanAccountNumber" TYPE BIGINT`,
    );

    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ALTER COLUMN "loanTotalAmount" TYPE NUMERIC`,
    );

    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ALTER COLUMN "loanDueAmount" TYPE NUMERIC`,
    );

    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ALTER COLUMN "loanRepaymentAmount" TYPE NUMERIC`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ALTER COLUMN"loanRepaymentAmount" TYPE INTEGER`,
    );

    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ALTER COLUMN "loanDueAmount" TYPE INTEGER`,
    );

    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ALTER COLUMN "loanTotalAmount" TYPE INTEGER`,
    );

    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ALTER COLUMN "loanAccountNumber" TYPE INTEGER`,
    );
  }
}
