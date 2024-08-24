import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewRejectionMsg1715110326317 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO integrator_error_mapping_entity
        ("integratorName", "endpointName", "receivedHttpCode", "receivedResponseStatusCode", "receivedRejectionOrErrorCode", "receivedErrorDescription", "mappedErrorCode", "mappedErrorMessage", "errorType")
        VALUES
        ('LOS', 'INTERACTION_TARGET', null, 2000, '1', null, '3016', 'You have used your full credit limit.', 'BUSINESS');
        `);
    await queryRunner.query(`INSERT INTO integrator_error_mapping_entity
        ("integratorName", "endpointName", "receivedHttpCode", "receivedResponseStatusCode", "receivedRejectionOrErrorCode", "receivedErrorDescription", "mappedErrorCode", "mappedErrorMessage", "errorType")
        VALUES
        ('LOS', 'INTERACTION_TARGET', null, 2000, '2', null, '3017', 'You do not meet our Credit Criterion, we cannot approve you at this point in time.', 'BUSINESS');`);
    await queryRunner.query(`INSERT INTO integrator_error_mapping_entity
        ("integratorName", "endpointName", "receivedHttpCode", "receivedResponseStatusCode", "receivedRejectionOrErrorCode", "receivedErrorDescription", "mappedErrorCode", "mappedErrorMessage", "errorType")
        VALUES
        ('LOS', 'INTERACTION_TARGET', null, 2000, '4', null, '3018', 'We are sorry, you are not eligible for loan product at the moment. Thanks for your interest in our product.', 'BUSINESS');
        `);
    await queryRunner.query(`INSERT INTO integrator_error_mapping_entity
        ("integratorName", "endpointName", "receivedHttpCode", "receivedResponseStatusCode", "receivedRejectionOrErrorCode", "receivedErrorDescription", "mappedErrorCode", "mappedErrorMessage", "errorType")
        VALUES
        ('LOS', 'INTERACTION_TARGET', null, 2000, '5', null, '3019', 'Customer application is already rejected" ### IT WAS USED EARLIER NOW NOT IN USE ###.', 'BUSINESS');
        `);
    await queryRunner.query(`INSERT INTO integrator_error_mapping_entity
        ("integratorName", "endpointName", "receivedHttpCode", "receivedResponseStatusCode", "receivedRejectionOrErrorCode", "receivedErrorDescription", "mappedErrorCode", "mappedErrorMessage", "errorType")
        VALUES
        ('LOS', 'INTERACTION_TARGET', null, 2000, '6', null, '3020', 'Customer is rejected on the onboarding flow.', 'BUSINESS');
        `);
    await queryRunner.query(`INSERT INTO integrator_error_mapping_entity
        ("integratorName", "endpointName", "receivedHttpCode", "receivedResponseStatusCode", "receivedRejectionOrErrorCode", "receivedErrorDescription", "mappedErrorCode", "mappedErrorMessage", "errorType")
        VALUES
        ('LOS', 'INTERACTION_TARGET', null, 2000, '8', null, '3021', 'Customer not in telco consent.', 'BUSINESS');
        `);
    await queryRunner.query(`INSERT INTO integrator_error_mapping_entity
        ("integratorName", "endpointName", "receivedHttpCode", "receivedResponseStatusCode", "receivedRejectionOrErrorCode", "receivedErrorDescription", "mappedErrorCode", "mappedErrorMessage", "errorType")
        VALUES
        ('LOS', 'INTERACTION_TARGET', null, 2000, '9', null, '3022', 'Customer telco txn details not found.', 'BUSINESS');
        `);
    await queryRunner.query(`INSERT INTO integrator_error_mapping_entity
        ("integratorName", "endpointName", "receivedHttpCode", "receivedResponseStatusCode", "receivedRejectionOrErrorCode", "receivedErrorDescription", "mappedErrorCode", "mappedErrorMessage", "errorType")
        VALUES
        ('LOS', 'INTERACTION_TARGET', null, 2000, '10', null, '3023', 'Customer is rejected on the Outstanding Fee.', 'BUSINESS');
        `);
    await queryRunner.query(`UPDATE integrator_error_mapping_entity
        SET "mappedErrorMessage" = 'Rejected because of age or because of Non-Ugandan.'
        WHERE "integratorName" = 'LOS'
                        AND "endpointName" = 'INTERACTION_TARGET'
                        AND "receivedRejectionOrErrorCode" = '3';
        `);
    await queryRunner.query(`UPDATE integrator_error_mapping_entity
        SET "mappedErrorMessage" = 'Customer is rejected on the Available Limit.'
        WHERE "integratorName" = 'LOS'
                        AND "endpointName" = 'INTERACTION_TARGET'
                        AND "receivedRejectionOrErrorCode" = '7';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM integrator_error_mapping_entity
                    WHERE
                    "integratorName" = 'LOS'
                      AND "endpointName" = 'INTERACTION_TARGET'
                      AND "receivedRejectionOrErrorCode" = '1';`,
    );
    await queryRunner.query(
      `DELETE FROM integrator_error_mapping_entity
                    WHERE
                    "integratorName" = 'LOS'
                      AND "endpointName" = 'INTERACTION_TARGET'
                      AND "receivedRejectionOrErrorCode" = '2';`,
    );
    await queryRunner.query(
      `DELETE FROM integrator_error_mapping_entity
                    WHERE
                    "integratorName" = 'LOS'
                      AND "endpointName" = 'INTERACTION_TARGET'
                      AND "receivedRejectionOrErrorCode" = '3';`,
    );
    await queryRunner.query(
      `DELETE FROM integrator_error_mapping_entity
                    WHERE
                    "integratorName" = 'LOS'
                      AND "endpointName" = 'INTERACTION_TARGET'
                      AND "receivedRejectionOrErrorCode" = '4';`,
    );
    await queryRunner.query(
      `DELETE FROM integrator_error_mapping_entity
                    WHERE
                    "integratorName" = 'LOS'
                      AND "endpointName" = 'INTERACTION_TARGET'
                      AND "receivedRejectionOrErrorCode" = '5';`,
    );
    await queryRunner.query(
      `DELETE FROM integrator_error_mapping_entity
                    WHERE
                    "integratorName" = 'LOS'
                      AND "endpointName" = 'INTERACTION_TARGET'
                      AND "receivedRejectionOrErrorCode" = '6';`,
    );
    await queryRunner.query(
      `DELETE FROM integrator_error_mapping_entity
                    WHERE
                    "integratorName" = 'LOS'
                      AND "endpointName" = 'INTERACTION_TARGET'
                      AND "receivedRejectionOrErrorCode" = '7';`,
    );
    await queryRunner.query(
      `DELETE FROM integrator_error_mapping_entity
                    WHERE
                    "integratorName" = 'LOS'
                      AND "endpointName" = 'INTERACTION_TARGET'
                      AND "receivedRejectionOrErrorCode" = '8';`,
    );
    await queryRunner.query(
      `DELETE FROM integrator_error_mapping_entity
                    WHERE
                    "integratorName" = 'LOS'
                      AND "endpointName" = 'INTERACTION_TARGET'
                      AND "receivedRejectionOrErrorCode" = '9';`,
    );
    await queryRunner.query(
      `DELETE FROM integrator_error_mapping_entity
                    WHERE
                    "integratorName" = 'LOS'
                      AND "endpointName" = 'INTERACTION_TARGET'
                      AND "receivedRejectionOrErrorCode" = '10';`,
    );
  }
}
