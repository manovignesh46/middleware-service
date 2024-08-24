import { MigrationInterface, QueryRunner } from 'typeorm';

export class RepayPaidDateWithTimezone1702438591813
  implements MigrationInterface
{
  name = 'RepayPaidDateWithTimezone1702438591813';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" DROP COLUMN "paidDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ADD "paidDate" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" DROP COLUMN "paidDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ADD "paidDate" TIMESTAMP`,
    );
  }
}
