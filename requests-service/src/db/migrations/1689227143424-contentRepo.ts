import { MigrationInterface, QueryRunner } from 'typeorm';

export class ContentRepo1689227143424 implements MigrationInterface {
  name = 'ContentRepo1689227143424';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "content" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contentName" character varying NOT NULL, "contentType" character varying NOT NULL, "message" character varying NOT NULL, "messageType" character varying NOT NULL, CONSTRAINT "PK_6a2083913f3647b44f205204e36" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "content"`);
  }
}
