import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultValueStudentDetails1710872507325
  implements MigrationInterface
{
  name = 'DefaultValueStudentDetails1710872507325';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_details" ALTER COLUMN "isComputedAmount" SET DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_details" ALTER COLUMN "isComputedAmount" DROP DEFAULT`,
    );
  }
}
