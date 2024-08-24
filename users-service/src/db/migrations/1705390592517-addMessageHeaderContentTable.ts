import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMessageHeaderContentTable1705390592517
  implements MigrationInterface
{
  name = 'AddMessageHeaderContentTable1705390592517';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content" ADD "messageHeader" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content" DROP COLUMN "messageHeader"`,
    );
  }
}
