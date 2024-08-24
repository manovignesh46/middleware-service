import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOtpNotSentStatus1707301383306 implements MigrationInterface {
  name = 'AddOtpNotSentStatus1707301383306';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."cust_otp_leadcurrentstatus_enum" RENAME TO "cust_otp_leadcurrentstatus_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."cust_otp_leadcurrentstatus_enum" AS ENUM('OTP_NOT_SENT', 'OTP_GENERATED', 'OTP_VERIFIED', 'OTP_FAILED', 'DEDUPE_FAILED', 'DEDUPE_SUCCESS', 'LEAD_CREATED', 'KYC_DONE', 'SANCTION_DONE', 'LEAD_VERIFIED', 'SCORING_DONE', 'LEAD_ENHANCED', 'LEAD_ONBOARDED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ALTER COLUMN "leadCurrentStatus" TYPE "public"."cust_otp_leadcurrentstatus_enum" USING "leadCurrentStatus"::"text"::"public"."cust_otp_leadcurrentstatus_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."cust_otp_leadcurrentstatus_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."cust_otp_leadcurrentstatus_enum_old" AS ENUM('OTP_GENERATED', 'OTP_VERIFIED', 'OTP_FAILED', 'DEDUPE_FAILED', 'DEDUPE_SUCCESS', 'LEAD_CREATED', 'KYC_DONE', 'SANCTION_DONE', 'LEAD_VERIFIED', 'SCORING_DONE', 'LEAD_ENHANCED', 'LEAD_ONBOARDED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ALTER COLUMN "leadCurrentStatus" TYPE "public"."cust_otp_leadcurrentstatus_enum_old" USING "leadCurrentStatus"::"text"::"public"."cust_otp_leadcurrentstatus_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."cust_otp_leadcurrentstatus_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."cust_otp_leadcurrentstatus_enum_old" RENAME TO "cust_otp_leadcurrentstatus_enum"`,
    );
  }
}
