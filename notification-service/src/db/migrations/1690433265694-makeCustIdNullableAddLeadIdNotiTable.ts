import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeCustIdNullableAddLeadIdNotiTable1690433265694
  implements MigrationInterface
{
  name = 'MakeCustIdNullableAddLeadIdNotiTable1690433265694';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "leadId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "customerId" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "customerId" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "leadId"`);
  }
}
