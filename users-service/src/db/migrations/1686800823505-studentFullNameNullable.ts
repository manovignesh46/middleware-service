import { MigrationInterface, QueryRunner } from 'typeorm';

export class StudentFullNameNullable1686800823505
  implements MigrationInterface
{
  name = 'StudentFullNameNullable1686800823505';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_details" ALTER COLUMN "studentFullName" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_details" ALTER COLUMN "studentFullName" SET NOT NULL`,
    );
  }
}
