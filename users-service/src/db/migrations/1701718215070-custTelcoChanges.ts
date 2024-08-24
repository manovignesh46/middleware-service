import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustTelcoChanges1701718215070 implements MigrationInterface {
  name = 'CustTelcoChanges1701718215070';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ALTER COLUMN "telcoId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ALTER COLUMN "ninComparison" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ALTER COLUMN "ninComparison" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ALTER COLUMN "telcoId" SET NOT NULL`,
    );
  }
}
