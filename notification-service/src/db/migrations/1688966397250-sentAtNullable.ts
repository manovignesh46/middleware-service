import { MigrationInterface, QueryRunner } from 'typeorm';

export class SentAtNullable1688966397250 implements MigrationInterface {
  name = 'SentAtNullable1688966397250';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "sentAt" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" ALTER COLUMN "sentAt" SET NOT NULL`,
    );
  }
}
