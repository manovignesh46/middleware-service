import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOtpAutoReadKey1718006770207 implements MigrationInterface {
  name = 'AddOtpAutoReadKey1718006770207';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'UPDATE public."content" SET "message"= \'Hello ${preferredName}. Use One Time Password (OTP) ${otp} for FURAHA authentication. Do not share OTP/PIN received from FURAHA with anyone. ${otpAutoReadKey}\' WHERE "contentName"=\'OTP_SMS\';',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'UPDATE public."content" SET "message"= \'Hello ${preferredName}. Use One Time Password (OTP) ${otp} for FURAHA authentication. Do not share OTP/PIN received from FURAHA with anyone.\' WHERE "contentName"=\'OTP_SMS\';',
    );
  }
}
