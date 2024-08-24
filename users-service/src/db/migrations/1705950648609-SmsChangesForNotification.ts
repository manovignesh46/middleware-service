import { MigrationInterface, QueryRunner } from 'typeorm';

export class SmsChangesForNotification1705950648609
  implements MigrationInterface
{
  name = 'SmsChangesForNotification1705950648609';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ADD "smsNextHours" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ADD "smsNextHours" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_otp" DROP COLUMN "smsNextHours"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" DROP COLUMN "smsNextHours"`,
    );
  }
}
