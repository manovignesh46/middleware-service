import { MigrationInterface, QueryRunner } from 'typeorm';

export class Fur2733AddColsCustPriDet1704936627266
  implements MigrationInterface
{
  name = 'Fur2733AddColsCustPriDet1704936627266';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ADD "preferredName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ADD "smsType" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ADD "smsCount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ADD "smsSentOn" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ADD "smsContent" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ADD "idExpiryDays" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ADD "idStatus" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" DROP COLUMN "idStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" DROP COLUMN "idExpiryDays"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" DROP COLUMN "smsContent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" DROP COLUMN "smsSentOn"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" DROP COLUMN "smsCount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" DROP COLUMN "smsType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" DROP COLUMN "preferredName"`,
    );
  }
}
