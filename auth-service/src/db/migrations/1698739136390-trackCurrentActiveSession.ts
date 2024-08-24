import { MigrationInterface, QueryRunner } from 'typeorm';

export class TrackCurrentActiveSession1698739136390
  implements MigrationInterface
{
  name = 'TrackCurrentActiveSession1698739136390';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device" ADD "currentActiveSession" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device" DROP COLUMN "currentActiveSession"`,
    );
  }
}
