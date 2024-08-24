import { MigrationInterface, QueryRunner } from 'typeorm';

export class LosRejCode31704159726521 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO integrator_error_mapping_entity
      ("integratorName", "endpointName", "receivedHttpCode", "receivedResponseStatusCode", "receivedRejectionOrErrorCode", "receivedErrorDescription", "mappedErrorCode", "mappedErrorMessage", "errorType")
    VALUES
      ('LOS', 'INTERACTION_OUTCOME', null, 2000, '3', null, '3011', 'We appreciate you taking time to apply. However, this feature is not available for you at the moment. Your interest will be noted for consideration in the upcoming update, and you will be notified if it becomes available.', 'BUSINESS'),
      ('LMS', 'DASHBOARD', null, 2000, '3', null, '3011', 'We appreciate you taking time to apply. However, this feature is not available for you at the moment. Your interest will be noted for consideration in the upcoming update, and you will be notified if it becomes available.', 'BUSINESS');
    `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM integrator_error_mapping_entity
      WHERE
      "integratorName" = 'LOS'
        AND "endpointName" = 'INTERACTION_OUTCOME'
        AND "receivedRejectionOrErrorCode" = '3';`,
    );
    await queryRunner.query(
      `DELETE FROM integrator_error_mapping_entity
      WHERE
      "integratorName" = 'LMS'
        AND "endpointName" = 'DASHBOARD'
        AND "receivedRejectionOrErrorCode" = '3';`,
    );
  }
}
