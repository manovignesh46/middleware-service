import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMtnIdColsCustOtp1707099160298 implements MigrationInterface {
  name = 'AddMtnIdColsCustOtp1707099160298';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ADD "mtnOptInReqId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ADD "mtnApprovalId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ADD "mtnValidationStatus" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_otp" DROP COLUMN "mtnValidationStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_otp" DROP COLUMN "mtnApprovalId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_otp" DROP COLUMN "mtnOptInReqId"`,
    );
  }
}
