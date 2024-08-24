import { MigrationInterface, QueryRunner } from 'typeorm';

export class RequestMigration1694121742420 implements MigrationInterface {
  name = 'RequestMigration1694121742420';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "request_operation" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "custId" character varying NOT NULL, "opName" character varying NOT NULL, "opState" character varying NOT NULL, "opDate" TIMESTAMP NOT NULL, "remark" character varying NOT NULL, CONSTRAINT "PK_7269fff72911560723f8f33b2cf" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "request_operation"`);
  }
}
