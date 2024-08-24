import { MigrationInterface, QueryRunner } from 'typeorm';

export class TrackFailedLoginCognito1698291642198
  implements MigrationInterface
{
  name = 'TrackFailedLoginCognito1698291642198';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cognito_detail" ADD "failedLoginAttempts" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "cognito_detail" ADD "loginLockedAt" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cognito_detail" DROP COLUMN "loginLockedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cognito_detail" DROP COLUMN "failedLoginAttempts"`,
    );
  }
}
