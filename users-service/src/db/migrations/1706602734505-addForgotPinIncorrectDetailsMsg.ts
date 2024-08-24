import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddForgotPinIncorrectDetailsMsg1706602734505
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO public.content ("contentName", "contentType", "messageHeader", "message", "messageType") VALUES(\'FORGOT_PIN_INCORRECT_DETAILS\', \'FORGOT_PIN\', \'FURAHA -  Oops! Incorrect Profile Data\', \'Hello ${preferredName}. The details you provided are incorrect. Please recheck and try again.\', \'text\');',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DELETE FROM public.content WHERE "contentName" = \'FORGOT_PIN_INCORRECT_DETAILS\';',
    );
  }
}
