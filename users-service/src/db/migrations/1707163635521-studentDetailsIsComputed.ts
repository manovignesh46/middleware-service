import { MigrationInterface, QueryRunner } from 'typeorm';

export class StudentDetailsIsComputed1707163635521
  implements MigrationInterface
{
  name = 'StudentDetailsIsComputed1707163635521';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "isComputedAmount" boolean`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "isComputedAmount"`,
    );
  }
}
