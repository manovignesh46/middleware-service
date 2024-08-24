import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustOtpWhitelistCriteriaAdded1718139711801
  implements MigrationInterface
{
  name = 'CustOtpWhitelistCriteriaAdded1718139711801';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ADD "whitelistCriteria" character varying(50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_otp" DROP COLUMN "whitelistCriteria"`,
    );
  }
}
