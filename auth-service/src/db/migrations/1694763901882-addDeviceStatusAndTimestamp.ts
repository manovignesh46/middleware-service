import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeviceStatusAndTimestamp1694763901882
  implements MigrationInterface
{
  name = 'AddDeviceStatusAndTimestamp1694763901882';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device" ADD "deviceStatus" character varying NOT NULL DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD "deviceStatusDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device" DROP COLUMN "deviceStatusDate"`,
    );
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "deviceStatus"`);
  }
}
