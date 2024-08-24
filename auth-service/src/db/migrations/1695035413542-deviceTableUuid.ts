import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeviceTableUuid1695035413542 implements MigrationInterface {
  name = 'DeviceTableUuid1695035413542';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "PK_6fe2df6e1c34fc6c18c786ca26e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "PK_98c404b1b8cd86a1651ccad52be" PRIMARY KEY ("deviceId", "id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "PK_98c404b1b8cd86a1651ccad52be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72" PRIMARY KEY ("id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "PK_98c404b1b8cd86a1651ccad52be" PRIMARY KEY ("deviceId", "id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "PK_98c404b1b8cd86a1651ccad52be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "PK_6fe2df6e1c34fc6c18c786ca26e" PRIMARY KEY ("deviceId")`,
    );
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "id"`);
  }
}
