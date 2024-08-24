import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRepaymentRecordDb1711449583546
  implements MigrationInterface
{
  name = 'UpdateRepaymentRecordDb1711449583546';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ADD "message" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ADD "status" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ADD "code" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" DROP COLUMN "code"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" DROP COLUMN "message"`,
    );
  }
}
