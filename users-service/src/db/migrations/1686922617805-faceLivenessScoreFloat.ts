import { MigrationInterface, QueryRunner } from 'typeorm';

export class FaceLivenessScoreFloat1686922617805 implements MigrationInterface {
  name = 'FaceLivenessScoreFloat1686922617805';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_scan_card_selfie_check_details" ALTER COLUMN "faceMatchScore" TYPE double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_scan_card_selfie_check_details" ALTER COLUMN "livenessScore" TYPE double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_scan_card_selfie_check_details" ALTER COLUMN "faceMatchComparisonResult" TYPE double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_scan_card_selfie_check_details" ALTER COLUMN "livenessComparisonResult" TYPE double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_scan_card_selfie_check_details" ALTER COLUMN "livenessComparisonResult" TYPE integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_scan_card_selfie_check_details" ALTER COLUMN "faceMatchComparisonResult" TYPE integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_scan_card_selfie_check_details" ALTER COLUMN "livenessScore" TYPE integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_scan_card_selfie_check_details" ALTER COLUMN "faceMatchScore" TYPE integer `,
    );
  }
}
