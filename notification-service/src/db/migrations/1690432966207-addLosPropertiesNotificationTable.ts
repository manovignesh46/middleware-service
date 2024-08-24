import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLosPropertiesNotificationTable1690432966207
  implements MigrationInterface
{
  name = 'AddLosPropertiesNotificationTable1690432966207';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "fullMsisdn" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "channel" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "eventName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "eventDate" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "transactionId" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "transactionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "eventDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "eventName"`,
    );
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "channel"`);
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "fullMsisdn"`,
    );
  }
}
