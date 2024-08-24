import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRepayTablePaidDateString1702453699542
  implements MigrationInterface
{
  name = 'ChangeRepayTablePaidDateString1702453699542';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" DROP COLUMN "paidDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ADD "paidDate" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" DROP COLUMN "paidDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ADD "paidDate" TIMESTAMP WITH TIME ZONE`,
    );
  }
}
