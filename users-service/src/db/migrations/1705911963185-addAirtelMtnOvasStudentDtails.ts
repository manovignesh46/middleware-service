import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAirtelMtnOvasStudentDtails1705911963185
  implements MigrationInterface
{
  name = 'AddAirtelMtnOvasStudentDtails1705911963185';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "mtnOva" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "airtelOva" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "airtelOva"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "mtnOva"`,
    );
  }
}
