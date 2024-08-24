import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAddressIdCardDetails1693384815758
  implements MigrationInterface
{
  name = 'AddAddressIdCardDetails1693384815758';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "addressLine1" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "addressLine2" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "addressLine3" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "city" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "countryOfResidence" character varying NOT NULL DEFAULT 'UG'`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "addressType" character varying NOT NULL DEFAULT 'RESIDENTIAL'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "addressType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "countryOfResidence"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "city"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "addressLine3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "addressLine2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "addressLine1"`,
    );
  }
}
