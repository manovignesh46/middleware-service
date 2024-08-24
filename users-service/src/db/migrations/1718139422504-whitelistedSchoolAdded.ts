import { MigrationInterface, QueryRunner } from 'typeorm';

export class WhitelistedSchoolAdded1718139422504 implements MigrationInterface {
  name = 'WhitelistedSchoolAdded1718139422504';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "whitelisted_school" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "schoolName" character varying(250) NOT NULL, "district" character varying(100), "emisCode" integer, "countryCode" character varying(5), CONSTRAINT "PK_99bd4dacbce53e2a9fd47201543" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "whitelisted_school"`);
  }
}
