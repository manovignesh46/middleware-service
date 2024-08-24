import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeStudentSchoolRegnNumberNullable1686811063497
  implements MigrationInterface
{
  name = 'MakeStudentSchoolRegnNumberNullable1686811063497';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_details" ALTER COLUMN "studentSchoolRegnNumber" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_details" ALTER COLUMN "studentSchoolRegnNumber" SET NOT NULL`,
    );
  }
}
