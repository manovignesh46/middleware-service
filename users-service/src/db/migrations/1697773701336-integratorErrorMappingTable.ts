import { MigrationInterface, QueryRunner } from 'typeorm';

export class IntegratorErrorMappingTable1697773701336
  implements MigrationInterface
{
  name = 'IntegratorErrorMappingTable1697773701336';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "integrator_error_mapping_entity" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "integratorName" character varying NOT NULL, "receivedHttpCode" integer array, "receivedResponseStatusCode" integer array, "receivedRejectionCode" integer array, "mappedErrorCode" integer NOT NULL, "mappedErrorMessage" character varying NOT NULL, CONSTRAINT "PK_574088282b2b23467c3d2472be4" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "integrator_error_mapping_entity"`);
  }
}
