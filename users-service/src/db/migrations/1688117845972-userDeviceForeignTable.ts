import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserDeviceForeignTable1688117845972 implements MigrationInterface {
  name = 'UserDeviceForeignTable1688117845972';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "topic_subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "topicArn" character varying NOT NULL, "subscriptionArn" character varying NOT NULL, "userDeviceUUIDId" uuid, CONSTRAINT "PK_d972ff017d4fba8217a99b6893c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device" DROP COLUMN "subscribedSnsTopics"`,
    );
    await queryRunner.query(
      `ALTER TABLE "topic_subscription" ADD CONSTRAINT "FK_bd0cf5977a70a6a4c09f8e3d93c" FOREIGN KEY ("userDeviceUUIDId") REFERENCES "user_device"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "topic_subscription" DROP CONSTRAINT "FK_bd0cf5977a70a6a4c09f8e3d93c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device" ADD "subscribedSnsTopics" text array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(`DROP TABLE "topic_subscription"`);
  }
}
