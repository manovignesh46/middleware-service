import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRejectionCodeToStringArray1697780235595
  implements MigrationInterface
{
  name = 'ChangeRejectionCodeToStringArray1697780235595';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" RENAME COLUMN "receivedRejectionCode" TO "receivedRejectionOrErrorCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" DROP COLUMN "receivedRejectionOrErrorCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ADD "receivedRejectionOrErrorCode" text array`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" DROP COLUMN "receivedRejectionOrErrorCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ADD "receivedRejectionOrErrorCode" integer array`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" RENAME COLUMN "receivedRejectionOrErrorCode" TO "receivedRejectionCode"`,
    );
  }
}
