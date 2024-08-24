import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeBigIntIntFormData1696329380484
  implements MigrationInterface
{
  name = 'ChangeBigIntIntFormData1696329380484';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "form_data" DROP COLUMN "requestCount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "form_data" ADD "requestCount" integer NOT NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "form_data" DROP COLUMN "requestCount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "form_data" ADD "requestCount" bigint NOT NULL DEFAULT '1'`,
    );
  }
}
