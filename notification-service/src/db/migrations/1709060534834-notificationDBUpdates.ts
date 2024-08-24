import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationDBUpdates1709060534834 implements MigrationInterface {
  name = 'NotificationDBUpdates1709060534834';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "pushDeliveryStatus" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "pushDeliveredAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "pushViewedStatus" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "pushViewedAt" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "pushViewedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "pushViewedStatus"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "pushDeliveredAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "pushDeliveryStatus"`,
    );
  }
}
