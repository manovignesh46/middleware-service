import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAddressIdCardDetailsAddDistrict1693386241481
  implements MigrationInterface
{
  name = 'AddAddressIdCardDetailsAddDistrict1693386241481';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "district" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "district"`,
    );
  }
}
