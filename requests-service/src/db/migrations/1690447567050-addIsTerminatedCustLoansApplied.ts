import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsTerminatedCustLoansApplied1690447567050
  implements MigrationInterface
{
  name = 'AddIsTerminatedCustLoansApplied1690447567050';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" ADD "isTerminated" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_loans_applied" DROP COLUMN "isTerminated"`,
    );
  }
}
