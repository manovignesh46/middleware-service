import { MigrationInterface, QueryRunner } from 'typeorm';

export class custOtp1681295935986 implements MigrationInterface {
  name = 'custOtp1681295935986';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ADD "targetApiUUID" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ADD "outcomeApiUUID" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_otp" DROP COLUMN "outcomeApiUUID"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_otp" DROP COLUMN "targetApiUUID"`,
    );
  }
}
