import { MigrationInterface, QueryRunner } from 'typeorm';

export class BizOrTechErrorMapping1698824700063 implements MigrationInterface {
  name = 'BizOrTechErrorMapping1698824700063';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ADD "errorType" character varying NOT NULL DEFAULT 'TECHINICAL'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" DROP COLUMN "errorType"`,
    );
  }
}
