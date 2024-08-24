import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRawParsedDatesCustIdCardDetails1691072691287
  implements MigrationInterface
{
  name = 'AddRawParsedDatesCustIdCardDetails1691072691287';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "parsedOcrNINExpiryDate" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "parsedOcrDOB" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "parsedMrzNINExpiryDate" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "rawMrzDOB" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "rawMrzDOB"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "parsedMrzNINExpiryDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "parsedOcrDOB"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "parsedOcrNINExpiryDate"`,
    );
  }
}
