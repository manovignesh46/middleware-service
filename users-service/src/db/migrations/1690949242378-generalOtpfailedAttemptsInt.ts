import { MigrationInterface, QueryRunner } from 'typeorm';

export class GeneralOtpfailedAttemptsInt1690949242378
  implements MigrationInterface
{
  name = 'GeneralOtpfailedAttemptsInt1690949242378';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "general_otp" DROP COLUMN "failedAttempts"`,
    );
    await queryRunner.query(
      `ALTER TABLE "general_otp" ADD "failedAttempts" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "general_otp" DROP COLUMN "failedAttempts"`,
    );
    await queryRunner.query(
      `ALTER TABLE "general_otp" ADD "failedAttempts" bigint NOT NULL`,
    );
  }
}
