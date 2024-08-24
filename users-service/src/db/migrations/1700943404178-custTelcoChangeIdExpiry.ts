import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustTelcoChangeIdExpiry1700943404178
  implements MigrationInterface
{
  name = 'CustTelcoChangeIdExpiry1700943404178';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ADD "idExpiry" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "cust_telco" DROP COLUMN "idExpiry"`);
  }
}
