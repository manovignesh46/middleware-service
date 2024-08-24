import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddApplicationStatusSecUUIDCustToLosTable1689043780412
  implements MigrationInterface
{
  name = 'AddApplicationStatusSecUUIDCustToLosTable1689043780412';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_to_los" ADD "applicationStatus" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_to_los" ADD "secondaryUUID" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_to_los" DROP COLUMN "secondaryUUID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_to_los" DROP COLUMN "applicationStatus"`,
    );
  }
}
