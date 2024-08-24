import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeColsNullableInErrMapping1698043723743
  implements MigrationInterface
{
  name = 'MakeColsNullableInErrMapping1698043723743';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ALTER COLUMN "receivedHttpCode" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ALTER COLUMN "receivedResponseStatusCode" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ALTER COLUMN "receivedRejectionOrErrorCode" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ALTER COLUMN "receivedRejectionOrErrorCode" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ALTER COLUMN "receivedResponseStatusCode" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ALTER COLUMN "receivedHttpCode" SET NOT NULL`,
    );
  }
}
