import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSmsLogTable1682481277985 implements MigrationInterface {
  name = 'AddSmsLogTable1682481277985';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "content" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contentName" character varying NOT NULL, "contentType" character varying NOT NULL, "message" character varying NOT NULL, "messageType" character varying NOT NULL, CONSTRAINT "PK_6a2083913f3647b44f205204e36" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sms_log" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contentName" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "smsContent" character varying NOT NULL, "smsType" character varying NOT NULL, CONSTRAINT "PK_8554ae1be4b0fb14d36cb190b61" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "sms_log"`);
    await queryRunner.query(`DROP TABLE "content"`);
  }
}
