import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustOtpNewFields1697489351607 implements MigrationInterface {
  name = 'CustOtpNewFields1697489351607';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ADD "telcoOp" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ADD "telcoUssdCode" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ADD "telcoWallet" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "offer_config" ALTER COLUMN "offerLimit" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offer_config" ALTER COLUMN "offerLimit" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "cust_otp" DROP COLUMN "telcoWallet"`);
    await queryRunner.query(
      `ALTER TABLE "cust_otp" DROP COLUMN "telcoUssdCode"`,
    );
    await queryRunner.query(`ALTER TABLE "cust_otp" DROP COLUMN "telcoOp"`);
  }
}
