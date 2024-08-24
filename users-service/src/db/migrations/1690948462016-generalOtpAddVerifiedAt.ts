import { MigrationInterface, QueryRunner } from 'typeorm';

export class GeneralOtpAddVerifiedAt1690948462016
  implements MigrationInterface
{
  name = 'GeneralOtpAddVerifiedAt1690948462016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "general_otp" ADD "verifiedAt" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "general_otp" DROP COLUMN "verifiedAt"`,
    );
  }
}
