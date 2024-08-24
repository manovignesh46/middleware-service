import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaymentsCountWhitelistedStud1708069221927
  implements MigrationInterface
{
  name = 'AddPaymentsCountWhitelistedStud1708069221927';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "whitelisted_student_details" ADD "paymentsCount" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "whitelisted_student_details" DROP COLUMN "paymentsCount"`,
    );
  }
}
