import { MigrationInterface, QueryRunner } from 'typeorm';

export class LmsErrorCodeUpdate1715248586865 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE integrator_error_mapping_entity
        SET "integratorName" = 'LMS', "endpointName" = 'DASHBOARD'
        WHERE "integratorName" = 'LOS'
                        AND "endpointName" = 'INTERACTION_TARGET'
                        AND "receivedRejectionOrErrorCode" = '4';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM integrator_error_mapping_entity
                          WHERE
                          "integratorName" = 'LMS'
                            AND "endpointName" = 'DASHBOARD'
                            AND "receivedRejectionOrErrorCode" = '4';`,
    );
  }
}
