import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeDobToDate1684599241833 implements MigrationInterface {
  name = 'ChangeDobToDate1684599241833';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "ocrDOB"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "ocrDOB" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "ocrDateOfExpiry"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "ocrDateOfExpiry" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "mrzDOB"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "mrzDOB" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "mrzExpirationDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "mrzExpirationDate" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "mrzIssuedDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "mrzIssuedDate" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "editedDOB"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "editedDOB" date`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "editedDOB"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "editedDOB" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "mrzIssuedDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "mrzIssuedDate" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "mrzExpirationDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "mrzExpirationDate" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "mrzDOB"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "mrzDOB" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "ocrDateOfExpiry"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "ocrDateOfExpiry" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "ocrDOB"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "ocrDOB" TIMESTAMP`,
    );
  }
}
