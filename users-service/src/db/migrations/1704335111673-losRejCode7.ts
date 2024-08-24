import { MigrationInterface, QueryRunner } from 'typeorm';

export class LosRejCode71704335111673 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO integrator_error_mapping_entity
            ("integratorName", "endpointName", "receivedHttpCode", "receivedResponseStatusCode", "receivedRejectionOrErrorCode", "receivedErrorDescription", "mappedErrorCode", "mappedErrorMessage", "errorType")
          VALUES
            ('LOS', 'INTERACTION_TARGET', null, 2000, '7', null, '3012', 'The outstanding school fees balance is less that the minimum loan amount you can borrow. We will not be able to progress with your application', 'BUSINESS');
          `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM integrator_error_mapping_entity
        WHERE
        "integratorName" = 'LOS'
          AND "endpointName" = 'INTERACTION_TARGET'
          AND "receivedRejectionOrErrorCode" = '7';`,
    );
  }
}
