import { MigrationInterface, QueryRunner } from 'typeorm';

export class OneToOneErrCodeMapping1698043278067 implements MigrationInterface {
  name = 'OneToOneErrCodeMapping1698043278067';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ADD "endpointName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" DROP COLUMN "receivedHttpCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ADD "receivedHttpCode" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" DROP COLUMN "receivedResponseStatusCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ADD "receivedResponseStatusCode" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" DROP COLUMN "receivedRejectionOrErrorCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ADD "receivedRejectionOrErrorCode" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" DROP COLUMN "mappedErrorCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ADD "mappedErrorCode" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" DROP COLUMN "mappedErrorCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ADD "mappedErrorCode" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" DROP COLUMN "receivedRejectionOrErrorCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ADD "receivedRejectionOrErrorCode" text array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" DROP COLUMN "receivedResponseStatusCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ADD "receivedResponseStatusCode" integer array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" DROP COLUMN "receivedHttpCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ADD "receivedHttpCode" integer array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" DROP COLUMN "endpointName"`,
    );
  }
}
