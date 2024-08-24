import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOtpSentCountLockedAt1700814846158
  implements MigrationInterface
{
  name = 'AddOtpSentCountLockedAt1700814846158';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "general_otp" ADD "otpSentLockedAt" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "general_otp" DROP COLUMN "otpSentLockedAt"`,
    );
  }
}
