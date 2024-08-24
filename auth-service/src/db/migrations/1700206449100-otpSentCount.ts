import { MigrationInterface, QueryRunner } from 'typeorm';

export class OtpSentCount1700206449100 implements MigrationInterface {
  name = 'OtpSentCount1700206449100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cognito_detail" ADD "otpSentCount" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cognito_detail" DROP COLUMN "otpSentCount"`,
    );
  }
}
