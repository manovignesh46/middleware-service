import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOTPtext1689137122677 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "UPDATE public.content SET message = 'Use One Time Password (OTP) ${otp} for FURAHA authentication. Do not share OTP/PIN received from FURAHA with anyone.' WHERE \"contentName\" = 'OTP_SMS'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "UPDATE public.content SET message = 'Your OTP is : ${otp}' WHERE \"contentName\" = 'OTP_SMS'",
    );
  }
}
