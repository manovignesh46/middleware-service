import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustOtpIsTerminatedColumn1686297684347
  implements MigrationInterface
{
  name = 'CustOtpIsTerminatedColumn1686297684347';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ADD "isTerminated" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_otp" DROP COLUMN "isTerminated"`,
    );
  }
}
