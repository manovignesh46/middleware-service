import { MigrationInterface, QueryRunner } from 'typeorm';

export class WhitelistStudentdetailsEntityChanges1692813530306
  implements MigrationInterface
{
  name = 'WhitelistStudentdetailsEntityChanges1692813530306';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "whitelisted_student_details" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "studentId" uuid NOT NULL DEFAULT uuid_generate_v4(), "associatedCustomerId" character varying, "aggregatorId" character varying, "requestReferenceNumber" character varying, "responseStatusCode" character varying, "responseStatusMessage" character varying, "studentSchoolRegnNumber" character varying, "studentFullName" character varying, "studentFirstName" character varying, "studentMiddleName" character varying, "studentSurname" character varying, "studentDob" TIMESTAMP, "studentDateCreated" TIMESTAMP, "studentGender" character varying, "studentClass" character varying, "studentSchoolCode" character varying, "schoolName" character varying, "currentSchoolFees" integer, "minPayableMode" character varying, "minPayableAmount" integer, "studentPaymentCode" character varying, "studentPCOId" character varying, "isCustomerConfirmed" boolean, "isStudentDeleted" boolean, "isLOSUpdated" boolean, "isLOSDeleted" boolean, "leadId" character varying, "currentStatus" character varying, "term1Fee" double precision, "term2Fee" double precision, "term3Fee" double precision, "termsAcademicYear" character varying, "totalTermsFee" double precision, "lastPaymentAmount" double precision, "lastPaymentDate" character varying, CONSTRAINT "PK_a9cc218c7eca4874c7a4b63cda6" PRIMARY KEY ("studentId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ADD "whitelisted" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ADD "whitelistedJSON" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_otp" DROP COLUMN "whitelistedJSON"`,
    );
    await queryRunner.query(`ALTER TABLE "cust_otp" DROP COLUMN "whitelisted"`);
    await queryRunner.query(`DROP TABLE "whitelisted_student_details"`);
  }
}
