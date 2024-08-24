import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOtpSentCountGeneralOtp1700810305022
  implements MigrationInterface
{
  name = 'AddOtpSentCountGeneralOtp1700810305022';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "general_otp" ADD "otpSentCount" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "general_otp" DROP COLUMN "otpSentCount"`,
    );
  }
}
