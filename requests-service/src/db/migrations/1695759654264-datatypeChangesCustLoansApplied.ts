import { MigrationInterface, QueryRunner } from 'typeorm';

export class DatatypeChangesCustLoansApplied1695759654264
  implements MigrationInterface
{
  name = 'DatatypeChangesCustLoansApplied1695759654264';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" DROP COLUMN "loanTotalAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" ADD "loanTotalAmount" numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" DROP COLUMN "loanInterestAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" ADD "loanInterestAmount" numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" DROP COLUMN "loanTotalAmountPayable"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" ADD "loanTotalAmountPayable" numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" DROP COLUMN "loanRepayAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" ADD "loanRepayAmount" numeric`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" DROP COLUMN "loanRepayAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" ADD "loanRepayAmount" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" DROP COLUMN "loanTotalAmountPayable"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" ADD "loanTotalAmountPayable" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" DROP COLUMN "loanInterestAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" ADD "loanInterestAmount" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" DROP COLUMN "loanTotalAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" ADD "loanTotalAmount" integer`,
    );
  }
}
