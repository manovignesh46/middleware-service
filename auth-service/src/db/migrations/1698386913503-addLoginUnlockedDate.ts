import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLoginUnlockedDate1698386913503 implements MigrationInterface {
  name = 'AddLoginUnlockedDate1698386913503';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cognito_detail" ADD "loginUnLockedAt" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cognito_detail" DROP COLUMN "loginUnLockedAt"`,
    );
  }
}
