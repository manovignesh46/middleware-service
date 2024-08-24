import { MigrationInterface, QueryRunner } from 'typeorm';

export class RejectLosCode1711563930805 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO integrator_error_mapping_entity
                  ("integratorName", "endpointName", "receivedHttpCode", "receivedResponseStatusCode", "receivedRejectionOrErrorCode", "receivedErrorDescription", "mappedErrorCode", "mappedErrorMessage", "errorType")
                VALUES
                  ('LOS', 'INTERACTION_TARGET', null, 2000, '11', null, '3013', 'Please check with school to have fees balances updated to proceed with application.', 'BUSINESS');
                `,
    );
    await queryRunner.query(
      `INSERT INTO integrator_error_mapping_entity
                  ("integratorName", "endpointName", "receivedHttpCode", "receivedResponseStatusCode", "receivedRejectionOrErrorCode", "receivedErrorDescription", "mappedErrorCode", "mappedErrorMessage", "errorType")
                VALUES
                  ('LOS', 'INTERACTION_TARGET', null, 2000, '12', null, '3014', 'As per School Fees Aggregator records, you have not made any previous payments for this student. Unfortunately, we are not able to proceed with the payment. You may pay for another student.', 'BUSINESS');
                `,
    );
    await queryRunner.query(
      `INSERT INTO integrator_error_mapping_entity
                  ("integratorName", "endpointName", "receivedHttpCode", "receivedResponseStatusCode", "receivedRejectionOrErrorCode", "receivedErrorDescription", "mappedErrorCode", "mappedErrorMessage", "errorType")
                VALUES
                  ('LOS', 'INTERACTION_TARGET', null, 2000, '13', null, '3015', 'New Loan Application Rejected. Customer still have unpaid due amount.', 'BUSINESS');
                `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM integrator_error_mapping_entity
              WHERE
              "integratorName" = 'LOS'
                AND "endpointName" = 'INTERACTION_TARGET'
                AND "receivedRejectionOrErrorCode" = '11';`,
    );
    await queryRunner.query(
      `DELETE FROM integrator_error_mapping_entity
              WHERE
              "integratorName" = 'LOS'
                AND "endpointName" = 'INTERACTION_TARGET'
                AND "receivedRejectionOrErrorCode" = '12';`,
    );
    await queryRunner.query(
      `DELETE FROM integrator_error_mapping_entity
              WHERE
              "integratorName" = 'LOS'
                AND "endpointName" = 'INTERACTION_TARGET'
                AND "receivedRejectionOrErrorCode" = '13';`,
    );
  }
}
