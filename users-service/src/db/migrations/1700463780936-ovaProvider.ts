import { MigrationInterface, QueryRunner } from 'typeorm';

export class OvaProvider1700463780936 implements MigrationInterface {
  name = 'OvaProvider1700463780936';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "ovaProvider" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "ovaProvider"`,
    );
  }
}
