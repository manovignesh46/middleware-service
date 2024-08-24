import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustRefiniiveResolutionChanges1707332863187
  implements MigrationInterface
{
  name = 'CustRefiniiveResolutionChanges1707332863187';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" ADD "resolutionDone" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" ADD "resolutionSentDate" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" ADD "resolutionStatus" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" DROP COLUMN "resolutionStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" DROP COLUMN "resolutionSentDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_refinitiv" DROP COLUMN "resolutionDone"`,
    );
  }
}
