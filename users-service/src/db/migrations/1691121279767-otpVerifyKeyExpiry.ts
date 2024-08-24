import { MigrationInterface, QueryRunner } from 'typeorm';

export class OtpVerifyKeyExpiry1691121279767 implements MigrationInterface {
  name = 'OtpVerifyKeyExpiry1691121279767';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "general_otp" ADD "otpVerifiedKey" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "general_otp" ADD "otpVerifiedKeyExpiredAt" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "general_otp" DROP COLUMN "otpVerifiedKeyExpiredAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "general_otp" DROP COLUMN "otpVerifiedKey"`,
    );
  }
}
