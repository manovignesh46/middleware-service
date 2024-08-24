import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustOtpRateLimitingColumns1710921412405
  implements MigrationInterface
{
  name = 'CustOtpRateLimitingColumns1710921412405';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cust_otp" DROP COLUMN "otpStatusAt"`);
    await queryRunner.query(`ALTER TABLE "cust_otp" DROP COLUMN "otpCount"`);
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ADD "failedAttempts" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ADD "lockedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ADD "otpSentCount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ADD "otpSentLockedAt" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_otp" DROP COLUMN "otpSentLockedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_otp" DROP COLUMN "otpSentCount"`,
    );
    await queryRunner.query(`ALTER TABLE "cust_otp" DROP COLUMN "lockedAt"`);
    await queryRunner.query(
      `ALTER TABLE "cust_otp" DROP COLUMN "failedAttempts"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ADD "otpCount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ADD "otpStatusAt" TIMESTAMP WITH TIME ZONE`,
    );
  }
}
