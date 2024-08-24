import { MigrationInterface, QueryRunner } from 'typeorm';

export class SelfieCheckMigration1683537515648 implements MigrationInterface {
  name = 'SelfieCheckMigration1683537515648';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cust_scan_card_selfie_check_details" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "custId" character varying NOT NULL, "faceMatchScore" integer NOT NULL, "livenessScore" integer NOT NULL, "faceMatchStatus" character varying NOT NULL, "livenessMatchStatus" character varying NOT NULL, "faceMatchComparisonResult" integer NOT NULL, "livenessComparisonResult" integer NOT NULL, "selfieImagePreSignedS3URL" character varying NOT NULL, "livenessVideoPreSignedS3URL" character varying NOT NULL, CONSTRAINT "PK_edf5a01450a370d6b5ec6ba6e12" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "isDeleted" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "isDeleted"`,
    );
    await queryRunner.query(`DROP TABLE "cust_scan_card_selfie_check_details"`);
  }
}
