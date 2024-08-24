import { MigrationInterface, QueryRunner } from 'typeorm';

export class PersistErroMsg1698123801436 implements MigrationInterface {
  name = 'PersistErroMsg1698123801436';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" ADD "receivedErrorDescription" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "integrator_error_mapping_entity" DROP COLUMN "receivedErrorDescription"`,
    );
  }
}
