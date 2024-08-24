import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustPriDetTotalLoanCreditExpiryTime1688555496879
  implements MigrationInterface
{
  name = 'CustPriDetTotalLoanCreditExpiryTime1688555496879';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ADD "totalLoans" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ADD "creditExpiryTime" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" DROP COLUMN "creditExpiryTime"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" DROP COLUMN "totalLoans"`,
    );
  }
}
