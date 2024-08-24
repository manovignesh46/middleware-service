import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMessageHeaderToNotificationTable1705390943204
  implements MigrationInterface
{
  name = 'AddMessageHeaderToNotificationTable1705390943204';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "messageHeader" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "messageHeader"`,
    );
  }
}
