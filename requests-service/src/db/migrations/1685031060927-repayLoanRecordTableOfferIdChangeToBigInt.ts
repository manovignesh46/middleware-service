import { MigrationInterface, QueryRunner } from 'typeorm';

export class RepayLoanRecordTableOfferIdChangeToBigInt1685031060927
  implements MigrationInterface
{
  name = 'RepayLoanRecordTableOfferIdChangeToBigInt1685031060927';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ALTER COLUMN "offerId" TYPE BIGINT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_loan_repayment_record" ALTER COLUMN "offerId" TYPE INTEGER`,
    );
  }
}
