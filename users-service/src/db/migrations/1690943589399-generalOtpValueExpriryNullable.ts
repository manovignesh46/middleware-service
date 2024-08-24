import { MigrationInterface, QueryRunner } from 'typeorm';

export class GeneralOtpValueExpriryNullable1690943589399
  implements MigrationInterface
{
  name = 'GeneralOtpValueExpriryNullable1690943589399';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "general_otp" ALTER COLUMN "otpValue" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "general_otp" ALTER COLUMN "expiredAt" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "general_otp" ALTER COLUMN "expiredAt" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "general_otp" ALTER COLUMN "otpValue" SET NOT NULL`,
    );
  }
}
