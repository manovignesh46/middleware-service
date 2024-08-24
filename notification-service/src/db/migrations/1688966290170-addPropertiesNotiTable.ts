import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPropertiesNotiTable1688966290170 implements MigrationInterface {
  name = 'AddPropertiesNotiTable1688966290170';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "isSent"`);
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "customerId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "priority" bigint NOT NULL DEFAULT '9'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "sourceMicroservice" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "sentAt" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "sentAt"`);
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "sourceMicroservice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "priority"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "customerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "isSent" boolean NOT NULL DEFAULT false`,
    );
  }
}
