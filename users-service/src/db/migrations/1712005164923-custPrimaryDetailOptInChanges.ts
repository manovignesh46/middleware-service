import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustPrimaryDetailOptInChanges1712005164923
  implements MigrationInterface
{
  name = 'CustPrimaryDetailOptInChanges1712005164923';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ADD "optOutReason" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ADD "optOutFeedback" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ADD "optOutDate" TIMESTAMP`,
    );
    await queryRunner.query(
      'INSERT INTO public.content ("contentName", "contentType", "messageHeader", "message", "messageType") VALUES(\'MTN_OPT_OUT_DETAILS\', \'MTN_OPT_OUT\', \'FURAHA - Your opt-out request was successful.\', \'You will no longer be able to access Furaha application and products.\', \'text\');',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" DROP COLUMN "optOutDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" DROP COLUMN "optOutFeedback"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" DROP COLUMN "optOutReason"`,
    );
    await queryRunner.query(
      'DELETE FROM public.content WHERE "contentName" = \'MTN_OPT_OUT_DETAILS\';',
    );
  }
}
