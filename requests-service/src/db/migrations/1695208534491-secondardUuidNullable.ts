import { MigrationInterface, QueryRunner } from 'typeorm';

export class SecondardUuidNullable1695208534491 implements MigrationInterface {
  name = 'SecondardUuidNullable1695208534491';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "request_to_los" ALTER COLUMN "secondaryUUID" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "request_to_los" ALTER COLUMN "secondaryUUID" SET NOT NULL`,
    );
  }
}
