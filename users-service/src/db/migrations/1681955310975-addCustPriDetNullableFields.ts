import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustPriDetNullableFields1681955310975
  implements MigrationInterface
{
  name = 'AddCustPriDetNullableFields1681955310975';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cust_id_card_details" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "custId" character varying NOT NULL, "ocrGivenName" character varying, "ocrSurname" character varying, "ocrNIN" character varying, "ocrDOB" TIMESTAMP, "ocrGender" character varying, "ocrNationality" character varying, "ocrDateOfExpiry" TIMESTAMP, "ocrCardNo" character varying, "ocrSignature" character varying, "ocrFace" character varying, "ocrIdFront" character varying, "ocrIdBack" character varying, "mrzGivenName" character varying, "mrzSurname" character varying, "mrzNIN" character varying, "mrzDOB" TIMESTAMP, "mrzGender" character varying, "mrzExpirationDate" TIMESTAMP, "mrzIssuedDate" TIMESTAMP, "mrzCountry" character varying, "mrzNationality" character varying, "mrzString" character varying, "requestLoadJSON" character varying, "scannedCardImageFront" character varying, "scannedCardImageBack" character varying, "faceImage" character varying, "editedGivenName" character varying, "editedSurname" character varying, "editedNIN" character varying, "editedDOB" TIMESTAMP, CONSTRAINT "PK_580258a6ed54a8d479b3708eeae" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cust_refinitiv" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "leadId" character varying NOT NULL, "sanctionStatus" character varying NOT NULL, CONSTRAINT "PK_346bdeae1abd3389a754e7fa45b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cust_scoring_data" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "leadId" character varying NOT NULL, "employmentNature" character varying NOT NULL, "numberOfDependents" integer NOT NULL, "typeOfHouse" character varying NOT NULL, "educationLevel" character varying NOT NULL, "maritalStatus" character varying NOT NULL, "creditScore" integer, "prequalifiedAmount" character varying, CONSTRAINT "PK_c89d3ed8aa38b7c010579decb13" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cust_telco" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "kycCheckId" uuid NOT NULL DEFAULT uuid_generate_v4(), "leadId" character varying NOT NULL, "telcoId" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "middleName" character varying NOT NULL, "isBarred" boolean NOT NULL, "registrationType" character varying NOT NULL, "msidn" character varying NOT NULL, "nationalIdNumber" character varying NOT NULL, "ninComparison" character varying NOT NULL, CONSTRAINT "PK_c9e79db3d20b450c9250db8c84a" PRIMARY KEY ("kycCheckId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "student_details" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "studentId" character varying NOT NULL, "studentName" character varying NOT NULL, "studentGender" character varying NOT NULL, "studentClass" integer NOT NULL, "studentSchoolCode" character varying NOT NULL, "studentSchoolRegnNumber" character varying NOT NULL, "schoolName" character varying NOT NULL, "studentAssociatedWith" character varying NOT NULL, "currentSchoolFees" integer NOT NULL, "losStudentReference" character varying, "studentPCOId" character varying, CONSTRAINT "PK_c09e9ebfb347739c6598297c0f5" PRIMARY KEY ("studentId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "clientType" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "email" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "surname" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "givenName" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "nationality" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "gender" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "dateOfBirth" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "NINOCR" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "cardNumber" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "dateOfExpiry" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "scannedImageFront" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "scannedImageBack" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "selfieImage" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "faceMatchPercentage" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "faceMatchStatus" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "liveliessCheckPercenatge" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "livelinessCheckStatus" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "livelinessCheckStatus" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "liveliessCheckPercenatge" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "faceMatchStatus" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "faceMatchPercentage" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "selfieImage" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "scannedImageBack" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "scannedImageFront" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "dateOfExpiry" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "cardNumber" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "NINOCR" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "dateOfBirth" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "gender" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "nationality" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "givenName" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "surname" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "email" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ALTER COLUMN "clientType" SET NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "student_details"`);
    await queryRunner.query(`DROP TABLE "cust_telco"`);
    await queryRunner.query(`DROP TABLE "cust_scoring_data"`);
    await queryRunner.query(`DROP TABLE "cust_refinitiv"`);
    await queryRunner.query(`DROP TABLE "cust_id_card_details"`);
  }
}
