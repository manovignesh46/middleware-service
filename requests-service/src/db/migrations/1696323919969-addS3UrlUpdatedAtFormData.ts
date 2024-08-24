import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddS3UrlUpdatedAtFormData1696323919969
  implements MigrationInterface
{
  name = 'AddS3UrlUpdatedAtFormData1696323919969';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "form_data" ADD "s3UrlUpdatedAt" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "form_data" DROP COLUMN "s3UrlUpdatedAt"`,
    );
  }
}
