import { MigrationInterface, QueryRunner } from 'typeorm';

export class DecimalEnablingForLoanfees1696959849753
  implements MigrationInterface
{
  name = 'DecimalEnablingForLoanfees1696959849753';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" DROP COLUMN "loanFees"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" ADD "loanFees" numeric`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" DROP COLUMN "loanFees"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" ADD "loanFees" integer`,
    );
  }
}
