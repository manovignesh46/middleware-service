import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReqToLosTable1695205827085 implements MigrationInterface {
  name = 'AddReqToLosTable1695205827085';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "request_to_los" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customerId" character varying NOT NULL, "secondaryUUID" character varying NOT NULL, "applicationStatus" character varying NOT NULL, "dataToCRM" character varying, "respFromCRM" character varying, CONSTRAINT "PK_35ce71293e449282e83c3b46fed" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "request_to_los"`);
  }
}
