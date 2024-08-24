import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeArraysNonNullable1697781101332 implements MigrationInterface {
  name = 'MakeArraysNonNullable1697781101332';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ALTER COLUMN "receivedHttpCode" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ALTER COLUMN "receivedHttpCode" SET DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ALTER COLUMN "receivedResponseStatusCode" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ALTER COLUMN "receivedResponseStatusCode" SET DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ALTER COLUMN "receivedRejectionOrErrorCode" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ALTER COLUMN "receivedRejectionOrErrorCode" SET DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ALTER COLUMN "receivedRejectionOrErrorCode" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ALTER COLUMN "receivedRejectionOrErrorCode" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ALTER COLUMN "receivedResponseStatusCode" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ALTER COLUMN "receivedResponseStatusCode" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ALTER COLUMN "receivedHttpCode" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ALTER COLUMN "receivedHttpCode" DROP NOT NULL`,
    );
  }
}
