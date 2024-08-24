import { MigrationInterface, QueryRunner } from 'typeorm';

export class StudentOvaPrePayAllowed1700096827196
  implements MigrationInterface
{
  name = 'StudentOvaPrePayAllowed1700096827196';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "isPartialPaymentAllowed" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "studentOva" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "studentOva"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "isPartialPaymentAllowed"`,
    );
  }
}
