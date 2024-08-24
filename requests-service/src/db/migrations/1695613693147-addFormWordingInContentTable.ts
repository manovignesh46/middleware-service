import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFormWordingInContentTable1695613693147
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO public.content ("contentName", "contentType", "message", "messageType") VALUES(\'AIM_AND_BENEFITS_OF_PRODUCT\', \'LOAN_APPLICATION_FORM\', \'This product offers School Fees Loans to the guardian on behalf of selected student. The loan is directly paid to the school account, and the borrower will repay the loan through Agency banking or from Furaha mobile application by debiting repayment amount from the mobile wallet. The product offers loans between UGX ${VARIANT_MIN_LOAN_AMOUNT} to UGX ${VARIANT_MAX_LOAN_AMOUNT} depending on the approved limit. User cannot take loan amounts higher than the outstanding School Fees Balance. User can take more than one loan.\nIf the loan due amount is not fully repaid by the Due Date, a Late Payment fee of ${LATE_PAYMENT_PERCENT}% will be applied on the overdue loan amount.\', \'text\');',
    );
    await queryRunner.query(
      'INSERT INTO public.content ("contentName", "contentType", "message", "messageType") VALUES(\'NOTE\', \'LOAN_APPLICATION_FORM\', \'1) In case you miss your repayment, a charge of ${MISSED_REPAYMENT_PERCENT}% will be applied on the overdue amount\n2) Loan Disbursement is made directly to school in favour of above student\', \'text\');',
    );
    await queryRunner.query(
      'INSERT INTO public.content ("contentName", "contentType", "message", "messageType") VALUES(\'DECLARATION\', \'LOAN_APPLICATION_FORM\', \'The loan has been given as per the terms and conditions accepted by you. Should you have any questions, please log into your Furaha App, go to "Contact Us" to log your complaint or inquiries, and we will respond to you within ${RESPONSE_TIME_SLA}\n\nOpportunity Bank Uganda Limited is regulated by Bank of Uganda.\', \'text\');',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DELETE FROM public.content WHERE "contentName" = \'AIM_AND_BENEFITS_OF_PRODUCT\' AND "contentType" = \'LOAN_APPLICATION_FORM\';',
    );
    await queryRunner.query(
      'DELETE FROM public.content WHERE "contentName" = \'NOTE\' AND "contentType" = \'LOAN_APPLICATION_FORM\';',
    );
    await queryRunner.query(
      'DELETE FROM public.content WHERE "contentName" = \'DECLARATION\' AND "contentType" = \'LOAN_APPLICATION_FORM\';',
    );
  }
}
