import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLoanTermiantedMyCustomerOtpContent1702978859774
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO public.content ("contentName", "contentType", "message", "messageType") VALUES(\'LOAN_TERMINATED_BY_CUSTOMER\', \'GENERAL\', \'Hello ${preferredName}. You can always come back. Get a 3-month loan of up to ${loanAmount} at a low interest of ${interestRate}%.\', \'text\');',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DELETE FROM public.content WHERE "contentName" = \'LOAN_TERMINATED_BY_CUSTOMER\';',
    );
  }
}
