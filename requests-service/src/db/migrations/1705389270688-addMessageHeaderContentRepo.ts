import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMessageHeaderContentRepo1705389270688
  implements MigrationInterface
{
  name = 'AddMessageHeaderContentRepo1705389270688';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content" ADD "messageHeader" character varying`,
    );
    await queryRunner.query(
      `UPDATE "content" SET "messageHeader" = 'FURAHA - Your Loan Request has been submitted' WHERE "contentName" = 'LOAN_SUBMITTED';`,
    );
    await queryRunner.query(
      `UPDATE "content" SET "messageHeader" = 'FURAHA - Your Loan Request has been submitted' WHERE "contentName" = 'LOAN_SUBMITTED';`,
    );
    await queryRunner.query(
      `UPDATE "content" SET "messageHeader" = 'FURAHA - You have Selected not to Accept our Offer' WHERE "contentName" = 'LOAN_TERMINATED_BY_CUSTOMER';`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content" DROP COLUMN "messageHeader"`,
    );
  }
}
