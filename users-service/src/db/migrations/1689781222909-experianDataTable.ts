import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExperianDataTable1689781222909 implements MigrationInterface {
  name = 'ExperianDataTable1689781222909';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "experian_data" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "idType" character varying NOT NULL, "idValue" character varying NOT NULL, "requestBody" character varying NOT NULL, "clientReferenceNumber" character varying NOT NULL, "requestType" character varying NOT NULL, "responseStatusCode" character varying, "experianData" character varying, "isDataSentToLOS" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT false, "latency" bigint, CONSTRAINT "PK_0f8362f1a320cb36b42971b2c33" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "experian_data"`);
  }
}
