import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNonPresignedUrlColumnsIdCardDetails1706848786138
  implements MigrationInterface
{
  name = 'AddNonPresignedUrlColumnsIdCardDetails1706848786138';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "nonPresignedImageFront" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "nonPresignedImageBack" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" ADD "nonPresignedFaceImage" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "nonPresignedFaceImage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "nonPresignedImageBack"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_id_card_details" DROP COLUMN "nonPresignedImageFront"`,
    );
  }
}
