import { MigrationInterface, QueryRunner } from 'typeorm';

export class TelcoTransactionTable1692634421438 implements MigrationInterface {
  name = 'TelcoTransactionTable1692634421438';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cust_telco_transaction" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "idType" character varying NOT NULL, "idValue" character varying NOT NULL, "telcoId" character varying NOT NULL, "transactionData" character varying NOT NULL, "isDataSentToLOS" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_72906d2427cc6a3ee9b3402b95b" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cust_telco_transaction"`);
  }
}
