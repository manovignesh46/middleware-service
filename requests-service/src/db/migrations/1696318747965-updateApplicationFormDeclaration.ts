import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateApplicationFormDeclaration1696318747965
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'UPDATE public.content SET message = \'The loan has been given as per the terms and conditions accepted by you. Should you have any questions, please log into your Furaha App, go to "Contact Us" to log your complaint or inquiries, and we will respond to you within ${RESPONSE_TIME_SLA}\' WHERE "contentType" = \'LOAN_APPLICATION_FORM\' AND "contentName" = \'DECLARATION\';',
    );
    await queryRunner.query(
      "UPDATE public.content SET message = '1) Loan Disbursement is made directly to school in favour of above student' WHERE \"contentType\" = 'LOAN_APPLICATION_FORM' AND \"contentName\" = 'NOTE';",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'UPDATE public.content SET message = \'The loan has been given as per the terms and conditions accepted by you. Should you have any questions, please log into your Furaha App, go to "Contact Us" to log your complaint or inquiries, and we will respond to you within ${RESPONSE_TIME_SLA}\n\nOpportunity Bank Uganda Limited is regulated by Bank of Uganda.\' WHERE "contentType" = \'LOAN_APPLICATION_FORM\' AND "contentName" = \'DECLARATION\';',
    );
    await queryRunner.query(
      "UPDATE public.content SET message = '1) In case you miss your repayment, a charge of ${MISSED_REPAYMENT_PERCENT}% will be applied on the overdue amount\n2) Loan Disbursement is made directly to school in favour of above student' WHERE \"contentType\" = 'LOAN_APPLICATION_FORM' AND \"contentName\" = 'NOTE';",
    );
  }
}
