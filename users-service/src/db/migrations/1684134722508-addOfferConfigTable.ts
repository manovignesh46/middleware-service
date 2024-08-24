import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOfferConfigTable1684134722508 implements MigrationInterface {
  name = 'AddOfferConfigTable1684134722508';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "offer_config" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "offerId" character varying NOT NULL, "offerName" character varying NOT NULL, "offerDescription" character varying NOT NULL, "offerImage" character varying, "offerProvider" character varying, "activeStatus" character varying NOT NULL, "tenure" integer NOT NULL, "roi" character varying NOT NULL, "noOfInstallment" character varying NOT NULL, "repaymentFrequency" character varying NOT NULL, "offerLimit" integer NOT NULL, "applicationFee" character varying NOT NULL, CONSTRAINT "PK_367b9b4cedf408b93042a81c9a2" PRIMARY KEY ("offerId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP CONSTRAINT "PK_c09e9ebfb347739c6598297c0f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "studentId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "studentId" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD CONSTRAINT "PK_c09e9ebfb347739c6598297c0f5" PRIMARY KEY ("studentId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP CONSTRAINT "PK_c09e9ebfb347739c6598297c0f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "studentId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "studentId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD CONSTRAINT "PK_c09e9ebfb347739c6598297c0f5" PRIMARY KEY ("studentId")`,
    );
    await queryRunner.query(`DROP TABLE "offer_config"`);
  }
}
