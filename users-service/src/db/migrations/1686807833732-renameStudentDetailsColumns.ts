import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameStudentDetailsColumns1686807833732
  implements MigrationInterface
{
  name = 'RenameStudentDetailsColumns1686807833732';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_details" RENAME COLUMN "isCustomerDeleted" TO "isStudentDeleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ADD "isLOSUpdated" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_details" DROP COLUMN "isLOSUpdated"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" RENAME COLUMN "isStudentDeleted" TO "isCustomerDeleted"`,
    );
  }
}
