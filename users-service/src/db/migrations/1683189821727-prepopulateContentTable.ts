import { MigrationInterface, QueryRunner } from 'typeorm';

export class PrepopulateContentTable1683189821727
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO public.content ("contentName", "contentType", "message", "messageType") VALUES(\'OTP_SMS\', \'OTP\', \'Your OTP is : ${otp}\', \'text\');',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DELETE FROM public.content WHERE "contentName" = \'OTP_SMS\';',
    );
  }
}
