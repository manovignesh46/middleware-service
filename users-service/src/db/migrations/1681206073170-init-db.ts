import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1681206073170 implements MigrationInterface {
  name = 'initDb1681206073170';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cust_to_los" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "leadId" character varying NOT NULL, "leadCurrentStatus" character varying NOT NULL, "dataToCRM" character varying NOT NULL, "respFromCRM" character varying, CONSTRAINT "PK_6dc27450ca0d626cbdc95369ca5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cust_dedup" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "leadId" character varying, "dedupRefNumber" character varying NOT NULL, "dedupStatus" character varying NOT NULL, "msisdnCountryCode" character varying, "msisdn" character varying, "nationalIdNumber" character varying, "email" character varying, CONSTRAINT "PK_1b4b75e1f7342d5128de789c704" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cust_primary_details" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "leadId" character varying NOT NULL, "clientType" character varying NOT NULL, "clientStatus" character varying NOT NULL, "msisdnCountryCode" character varying NOT NULL, "msisdn" character varying NOT NULL, "nationalIdNumber" character varying NOT NULL, "email" character varying NOT NULL, "surname" character varying NOT NULL, "givenName" character varying NOT NULL, "nationality" character varying NOT NULL, "gender" character varying NOT NULL, "dateOfBirth" TIMESTAMP NOT NULL, "NINOCR" character varying NOT NULL, "cardNumber" character varying NOT NULL, "dateOfExpiry" TIMESTAMP NOT NULL, "scannedImageFront" character varying NOT NULL, "scannedImageBack" character varying NOT NULL, "selfieImage" character varying NOT NULL, "faceMatchPercentage" integer NOT NULL, "faceMatchStatus" character varying NOT NULL, "liveliessCheckPercenatge" integer NOT NULL, "livelinessCheckStatus" character varying NOT NULL, CONSTRAINT "PK_dbbddbdc24ddd3dc08e385acadd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."cust_otp_otptype_enum" AS ENUM('SMS', 'EMAIL', 'BOTH')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."cust_otp_leadcurrentstatus_enum" AS ENUM('OTP_GENERATED', 'OTP_VERIFIED', 'OTP_FAILED', 'DEDUPE_FAILED', 'DEDUPE_SUCCESS', 'LEAD_CREATED', 'KYC_DONE', 'SANCTION_DONE', 'LEAD_VERIFIED', 'SCORING_DONE', 'LEAD_ENHANCED', 'LEAD_ONBOARDED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "cust_otp" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "leadId" uuid NOT NULL DEFAULT uuid_generate_v4(), "msisdn" character varying NOT NULL, "msisdnCountryCode" character varying NOT NULL, "preferredName" character varying NOT NULL, "nationalIdNumber" character varying NOT NULL, "email" character varying, "otp" character varying, "otpCreatedAt" TIMESTAMP WITH TIME ZONE, "otpStatusAt" TIMESTAMP WITH TIME ZONE, "otpSentAt" TIMESTAMP WITH TIME ZONE, "otpType" "public"."cust_otp_otptype_enum", "phoneStatus" boolean, "emailStatus" boolean, "otpExpiry" TIMESTAMP WITH TIME ZONE, "otpCount" integer NOT NULL, "leadCurrentStatus" "public"."cust_otp_leadcurrentstatus_enum" NOT NULL, CONSTRAINT "PK_da816eb15e7eb0b002b08e65dbe" PRIMARY KEY ("leadId"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cust_otp"`);
    await queryRunner.query(
      `DROP TYPE "public"."cust_otp_leadcurrentstatus_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."cust_otp_otptype_enum"`);
    await queryRunner.query(`DROP TABLE "cust_primary_details"`);
    await queryRunner.query(`DROP TABLE "cust_dedup"`);
    await queryRunner.query(`DROP TABLE "cust_to_los"`);
  }
}
