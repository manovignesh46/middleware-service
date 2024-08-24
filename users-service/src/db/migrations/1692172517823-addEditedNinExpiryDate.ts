import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEditedNinExpiryDate1692172517823 implements MigrationInterface {
  name = 'AddEditedNinExpiryDate1692172517823';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "editedNINExpiryDate" date`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "editedNINExpiryDate"`,
    );
  }
}
