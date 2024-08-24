import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameMsisdn1693189065787 implements MigrationInterface {
  name = 'RenameMsisdn1693189065787';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_telco" RENAME COLUMN "msidn" TO "msisdn"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_telco" RENAME COLUMN "msisdn" TO "msidn"`,
    );
  }
}
