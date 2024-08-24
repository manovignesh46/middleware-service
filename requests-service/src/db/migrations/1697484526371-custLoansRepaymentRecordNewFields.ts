import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustLoansRepaymentRecordNewFields1697484526371
  implements MigrationInterface
{
  name = 'CustLoansRepaymentRecordNewFields1697484526371';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ADD "transactionId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ADD "externalTransactionId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ADD "statusReason" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ADD "referenceId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ADD "amountPaid" numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ADD "paidDate" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ADD "outstandingBalance" numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ADD "outstandingPrincipal" numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ADD "outstandingInterest" numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ADD "outstandingFee" numeric`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" DROP COLUMN "outstandingFee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" DROP COLUMN "outstandingInterest"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" DROP COLUMN "outstandingPrincipal"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" DROP COLUMN "outstandingBalance"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" DROP COLUMN "paidDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" DROP COLUMN "amountPaid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" DROP COLUMN "referenceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" DROP COLUMN "statusReason"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" DROP COLUMN "externalTransactionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" DROP COLUMN "transactionId"`,
    );
  }
}
