import { MigrationInterface, QueryRunner } from 'typeorm';

export class RetryUploadAndChangestudentClassToVarChar1686664660747
  implements MigrationInterface
{
  name = 'RetryUploadAndChangestudentClassToVarChar1686664660747';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_scan_card_selfie_check_details" ADD "retryCount" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_details" ALTER COLUMN "studentClass" TYPE character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_details" ALTER COLUMN "studentClass" TYPE integer USING "studentClass"::integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_scan_card_selfie_check_details" DROP COLUMN "retryCount"`,
    );
  }
}
