import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserDeviceAndTopicSubscriptionTables1708930124407
  implements MigrationInterface
{
  name = 'UpdateUserDeviceAndTopicSubscriptionTables1708930124407';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_device" ADD "deviceOs" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device" ADD "platformApplicationEndpoint" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "topic_subscription" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "topic_subscription" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device" ADD CONSTRAINT "UQ_cbea4a60cea04400f75391a70e2" UNIQUE ("deviceId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_device" DROP CONSTRAINT "UQ_cbea4a60cea04400f75391a70e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "topic_subscription" DROP COLUMN "updatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "topic_subscription" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device" DROP COLUMN "platformApplicationEndpoint"`,
    );
    await queryRunner.query(`ALTER TABLE "user_device" DROP COLUMN "deviceOs"`);
  }
}
