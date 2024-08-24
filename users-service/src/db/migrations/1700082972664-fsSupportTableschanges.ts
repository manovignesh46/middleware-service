import { MigrationInterface, QueryRunner } from 'typeorm';

export class FsSupportTablesChanges1700082972664 implements MigrationInterface {
  name = 'FsSupportTablesChanges1700082972664';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_fs_registration" DROP COLUMN "fsRequesterId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_fs_registration" ADD "fsRequesterId" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_ticket_details" DROP COLUMN "tktRequesterId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_ticket_details" ADD "tktRequesterId" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_ticket_details" DROP COLUMN "tktRequestedForId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_ticket_details" ADD "tktRequestedForId" bigint NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_ticket_details" DROP COLUMN "tktRequestedForId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_ticket_details" ADD "tktRequestedForId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_ticket_details" DROP COLUMN "tktRequesterId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_ticket_details" ADD "tktRequesterId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_fs_registration" DROP COLUMN "fsRequesterId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_fs_registration" ADD "fsRequesterId" integer NOT NULL`,
    );
  }
}
