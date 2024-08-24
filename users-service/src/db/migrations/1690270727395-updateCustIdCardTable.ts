import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCustIdCardTable1690270727395 implements MigrationInterface {
  name = 'UpdateCustIdCardTable1690270727395';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "ocrNINExpiryDate" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "mrzNINExpiryDate" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "telcoNINMrzStatus" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "telcoNameMrzStatus" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "telcoNameMrzPercent" double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "telcoNameMrzPercent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "telcoNameMrzStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "telcoNINMrzStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "mrzNINExpiryDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "ocrNINExpiryDate"`,
    );
  }
}
