import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFaqTable1692246252689 implements MigrationInterface {
  name = 'AddFaqTable1692246252689';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "faq" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category" character varying NOT NULL, "faq" character varying NOT NULL, "faqAns" character varying NOT NULL, "isActive" boolean NOT NULL, "createdBy" character varying NOT NULL, "updatedBy" character varying NOT NULL, CONSTRAINT "PK_d6f5a52b1a96dd8d0591f9fbc47" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "faq"`);
  }
}
