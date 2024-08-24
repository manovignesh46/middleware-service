import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustIdCardDetailsUpdate1706507650124
  implements MigrationInterface
{
  name = 'CustIdCardDetailsUpdate1706507650124';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "givenNameMatchStatus" boolean`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "surNameMatchStatus" boolean`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "dobMatchStatus" boolean`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "ninMatchStatus" boolean`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "ninExpiryMatchStatus" boolean`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "ninExpiryMatchStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "ninMatchStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "dobMatchStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "surNameMatchStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "givenNameMatchStatus"`,
    );
  }
}
