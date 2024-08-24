import { MigrationInterface, QueryRunner } from 'typeorm';

export class OcrDobChangeToString1684917719689 implements MigrationInterface {
  name = 'OcrDobChangeToString1684917719689';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "ocrDOB"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "ocrDOB" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "ocrDOB"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "ocrDOB" date`,
    );
  }
}
