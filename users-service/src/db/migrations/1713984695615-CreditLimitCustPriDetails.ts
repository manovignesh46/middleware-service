import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreditLimitCustPriDetails1713984695615
  implements MigrationInterface
{
  name = 'CreditLimitCustPriDetails1713984695615';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ADD "availableCreditLimit" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" DROP COLUMN "availableCreditLimit"`,
    );
  }
}
