import { MigrationInterface, QueryRunner } from 'typeorm';

export class NoOfInstallmentsNullable1688566303366
  implements MigrationInterface
{
  name = 'NoOfInstallmentsNullable1688566303366';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offer_config" ALTER COLUMN "noOfInstallment" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "offer_config" ALTER COLUMN "noOfInstallment" SET NOT NULL`,
    );
  }
}
