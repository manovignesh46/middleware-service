import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSnsMsgId1688958385942 implements MigrationInterface {
  name = 'AddSnsMsgId1688958385942';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "snsMessageId" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "snsMessageId"`,
    );
  }
}
