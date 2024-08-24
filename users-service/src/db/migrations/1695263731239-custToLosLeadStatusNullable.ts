import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustToLosLeadStatusNullable1695263731239
  implements MigrationInterface
{
  name = 'CustToLosLeadStatusNullable1695263731239';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_to_los" ALTER COLUMN "leadCurrentStatus" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_to_los" ALTER COLUMN "leadCurrentStatus" SET NOT NULL`,
    );
  }
}
