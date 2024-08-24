import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserDevice1688111771415 implements MigrationInterface {
  name = 'UpdateUserDevice1688111771415';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_device" DROP COLUMN "customerId"`,
    );
    await queryRunner.query(`ALTER TABLE "user_device" DROP COLUMN "leadId"`);
    await queryRunner.query(
      `ALTER TABLE "user_device" ADD "customerOrLeadId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device" ADD "idType" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_device" DROP COLUMN "idType"`);
    await queryRunner.query(
      `ALTER TABLE "user_device" DROP COLUMN "customerOrLeadId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device" ADD "leadId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_device" ADD "customerId" character varying`,
    );
  }
}
