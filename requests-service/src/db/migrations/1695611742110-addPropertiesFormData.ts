import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPropertiesFormData1695611742110 implements MigrationInterface {
  name = 'AddPropertiesFormData1695611742110';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "form_data" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customerId" character varying, "fullMsisdn" character varying, "loanId" character varying, "typeId" character varying, "formData" character varying, "formType" character varying NOT NULL, "formStatus" character varying, "s3Bucket" character varying, "s3DocPath" character varying, "s3PresignedUrl" character varying, "requestCount" bigint NOT NULL DEFAULT '1', "createdBy" character varying, "updatedBy" character varying, CONSTRAINT "PK_e88b5f744d04e74477c7952cf6e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "form_data"`);
  }
}
