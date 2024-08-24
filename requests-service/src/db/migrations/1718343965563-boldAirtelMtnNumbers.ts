import { MigrationInterface, QueryRunner } from 'typeorm';

export class BoldAirtelMtnNumbers1718343965563 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "UPDATE public.content SET message = 'The loan has been given as per the ${TERMS_AND_CONDITION} accepted by you. Should you have any question, please contact through our FURAHA App Customer Support tools or get in touch with our customer care team <b>0326220200</b> (MTN) or <b>0200776600</b> (Airtel).||Opportunity Bank Uganda Limited is regulated by Bank of Uganda. Customer deposists are protected by the Deposit protection fund upto UGX 10M.' WHERE \"contentType\" = 'LOAN_APPLICATION_FORM' AND \"contentName\" = 'DECLARATION';",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "UPDATE public.content SET message = 'The loan has been given as per the ${TERMS_AND_CONDITION} accepted by you. Should you have any question, please contact through our FURAHA App Customer Support tools or get in touch with our customer care team 0326220200 (MTN) or  0200776600 (Airtel).||Opportunity Bank Uganda Limited is regulated by Bank of Uganda. Customer deposists are protected by the Deposit protection fund upto UGX 10M.' WHERE \"contentType\" = 'LOAN_APPLICATION_FORM' AND \"contentName\" = 'DECLARATION';",
    );
  }
}
