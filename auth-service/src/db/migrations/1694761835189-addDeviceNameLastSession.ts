import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeviceNameLastSession1694761835189
  implements MigrationInterface
{
  name = 'AddDeviceNameLastSession1694761835189';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device" ADD "lastActiveSession" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD "deviceName" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "deviceName"`);
    await queryRunner.query(
      `ALTER TABLE "device" DROP COLUMN "lastActiveSession"`,
    );
  }
}
