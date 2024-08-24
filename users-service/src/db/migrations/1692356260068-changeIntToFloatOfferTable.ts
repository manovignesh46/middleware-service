import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeIntToFloatOfferTable1692356260068
  implements MigrationInterface
{
  name = 'ChangeIntToFloatOfferTable1692356260068';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offer_config" ALTER COLUMN "offerLimit" TYPE NUMERIC`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offer_config" ALTER COLUMN "offerLimit" TYPE INTEGER`,
    );
  }
}
