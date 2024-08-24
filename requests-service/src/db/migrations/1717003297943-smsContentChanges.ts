import { MigrationInterface, QueryRunner } from 'typeorm';

export class SmsContentChanges1717003297943 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "UPDATE public.content SET message = 'Hello ${preferredName}. You can always come back. Get a 3-month loan of up to ${loanAmount} at a low interest of ${interestRate}%. FURAHA ' WHERE \"contentType\" = 'GENERAL' AND \"contentName\" = 'LOAN_TERMINATED_BY_CUSTOMER';",
    );
    await queryRunner.query(
      "UPDATE public.content SET message = 'Dear ${preferredName}. Your FURAHA School Fees Loan by OPPORTUNITY BANK UGANDA LIMITED has been successfully submitted. ' WHERE \"contentType\" = 'GENERAL' AND \"contentName\" = 'LOAN_SUBMITTED';",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DELETE FROM public.content WHERE "contentName" = \'LOAN_TERMINATED_BY_CUSTOMER\';',
    );
  }
}
