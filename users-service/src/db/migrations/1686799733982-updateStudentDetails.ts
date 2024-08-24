import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateStudentDetails1686799733982 implements MigrationInterface {
  name = 'UpdateStudentDetails1686799733982';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_details" RENAME COLUMN "isDeleted" TO "isCustomerDeleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" RENAME COLUMN "studentAssociatedWith" TO "associatedCustomerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" RENAME COLUMN "studentName" TO "studentFullName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "losStudentReference"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "aggregatorId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "requestReferenceNumber" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "responseStatusCode" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "responseStatusMessage" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "studentFirstName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "studentMiddleName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "studentSurname" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "studentDob" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "studentDateCreated" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "minPayableMode" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "minPayableAmount" bigint`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "studentPaymentCode" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "isCustomerConfirmed" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "isLOSDeleted" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ALTER COLUMN "studentGender" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ALTER COLUMN "studentClass" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ALTER COLUMN "studentSchoolCode" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ALTER COLUMN "schoolName" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ALTER COLUMN "currentSchoolFees" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_details" ALTER COLUMN "currentSchoolFees" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ALTER COLUMN "schoolName" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ALTER COLUMN "studentSchoolCode" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ALTER COLUMN "studentClass" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ALTER COLUMN "studentGender" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "isLOSDeleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "isCustomerConfirmed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "studentPaymentCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "minPayableAmount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "minPayableMode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "studentDateCreated"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "studentDob"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "studentSurname"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "studentMiddleName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "studentFirstName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "responseStatusMessage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "responseStatusCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "requestReferenceNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "aggregatorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "losStudentReference" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" RENAME COLUMN "studentFullName" TO "studentName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" RENAME COLUMN "associatedCustomerId" TO "studentAssociatedWith"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" RENAME COLUMN "isCustomerDeleted" TO "isDeleted"`,
    );
  }
}
