import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserDevice1687835147394 implements MigrationInterface {
  name = 'UserDevice1687835147394';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_device" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customerId" character varying, "leadId" character varying, "deviceId" character varying NOT NULL, "firebaseDeviceToken" character varying, "snsEndpoint" character varying, "subscribedSnsTopics" text array NOT NULL DEFAULT '{}', "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_0232591a0b48e1eb92f3ec5d0d1" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_device"`);
  }
}
