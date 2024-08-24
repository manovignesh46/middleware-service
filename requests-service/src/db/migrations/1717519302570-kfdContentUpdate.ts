import { MigrationInterface, QueryRunner } from 'typeorm';

export class KfdContentUpdate1717519302570 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "UPDATE public.content SET message = 'This product offers School Fees Loans to the guardian on behalf of selected student. The loan is directly paid to the school account in favour of the student provided in the application. The borrower will repay the loan through Furaha mobile application by debiting repayment amount from the mobile wallet, direct debits from the borrower mobile money wallet or other channels FURAHA may provide for.||The product offers loans between {UGX ${VARIANT_MIN_LOAN_AMOUNT} to UGX ${VARIANT_MAX_LOAN_AMOUNT}} depending on the approved credit limit, but each loan should not exceed the outstanding School Fees Balance for the student provided in the application.' WHERE \"contentType\" = 'LOAN_APPLICATION_FORM' AND \"contentName\" = 'AIM_AND_BENEFITS_OF_PRODUCT';",
    );
    await queryRunner.query(
      "UPDATE public.content SET message = '1) In case you miss your repayment, a charge of 2.5% will be applied on the overdule amount. ||2) Overdue Loan amounts will be directly debited from your Mobile Money wallet and reported to Credit Reference Bureaus.' WHERE \"contentType\" = 'LOAN_APPLICATION_FORM' AND \"contentName\" = 'NOTE';",
    );
    await queryRunner.query(
      "UPDATE public.content SET message = 'The loan has been given as per the ${TERMS_AND_CONDITION} accepted by you. Should you have any question, please contact through our FURAHA App Customer Support tools or get in touch with our customer care team 0326220200 (MTN) or  0200776600 (Airtel).||Opportunity Bank Uganda Limited is regulated by Bank of Uganda. Customer deposists are protected by the Deposit protection fund upto UGX 10M.' WHERE \"contentType\" = 'LOAN_APPLICATION_FORM' AND \"contentName\" = 'DECLARATION';",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DELETE FROM public.content WHERE "contentName" = \'AIM_AND_BENEFITS_OF_PRODUCT\';',
    );
    await queryRunner.query(
      'DELETE FROM public.content WHERE "contentName" = \'NOTE\';',
    );
    await queryRunner.query(
      'DELETE FROM public.content WHERE "contentName" = \'DECLARATION\';',
    );
  }
}
