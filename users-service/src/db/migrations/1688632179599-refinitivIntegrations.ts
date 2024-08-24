import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefinitivIntegrations1688632179599 implements MigrationInterface {
  name = 'RefinitivIntegrations1688632179599';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" RENAME COLUMN "leadId" TO "idValue"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" ADD "idType" character varying`,
    );

    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" ADD "caseId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" ADD "caseSystemId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" ADD "lastScreenedDatesByProviderType" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" ADD "resultsCount" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" ADD "resultIdReferenceId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" ADD "recieveedResponse" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" ADD "matchedResultElement" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" ADD "isDataSentToLOS" boolean`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" ADD "isActive" boolean`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" DROP COLUMN "isActive"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" DROP COLUMN "isDataSentToLOS"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" DROP COLUMN "matchedResultElement"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" DROP COLUMN "recieveedResponse"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" DROP COLUMN "resultIdReferenceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" DROP COLUMN "resultsCount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" DROP COLUMN "lastScreenedDatesByProviderType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" DROP COLUMN "caseSystemId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" DROP COLUMN "caseId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" DROP COLUMN "idType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" RENAME COLUMN "idValue" TO "leadId"`,
    );
  }
}
