import { MigrationInterface, QueryRunner } from 'typeorm';

export class PrepopulateContentTable1689227244647
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO public.content ("contentName", "contentType", "message", "messageType") VALUES(\'LOAN_SUBMITTED\', \'GENERAL\', \'Dear ${preferredName}, Your School Fees Loan has been successfully submitted. You will receive a confirmation from the school shortly.\', \'text\');',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DELETE FROM public.content WHERE "contentName" = \'LOAN_SUBMITTED\';',
    );
  }
}
