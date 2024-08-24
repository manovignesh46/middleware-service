import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveSmsColsFromCustPriDetails1705047050432
  implements MigrationInterface
{
  name = 'RemoveSmsColsFromCustPriDetails1705047050432';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" DROP COLUMN "smsCount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" DROP COLUMN "smsSentOn"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" DROP COLUMN "smsType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" DROP COLUMN "smsContent"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ADD "smsContent" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ADD "smsType" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ADD "smsSentOn" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ADD "smsCount" integer NOT NULL DEFAULT '0'`,
    );
  }
}
