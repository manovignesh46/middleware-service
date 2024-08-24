import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTerminationReasonCustOtp1694063682411
  implements MigrationInterface
{
  name = 'AddTerminationReasonCustOtp1694063682411';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_otp" ADD "terminationReason" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_otp" DROP COLUMN "terminationReason"`,
    );
  }
}
