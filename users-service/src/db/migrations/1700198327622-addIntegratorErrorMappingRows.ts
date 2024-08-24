import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIntegratorErrorMappingRows1700198327622
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO integrator_error_mapping_entity ("integratorName","mappedErrorMessage","endpointName","receivedHttpCode","receivedResponseStatusCode","receivedRejectionOrErrorCode","mappedErrorCode","receivedErrorDescription","errorType")
      VALUES 
      ('SCHOOL_PAY','No student matching the provided student number','GET_STUDENT_DETAILS',NULL,100,NULL,'3050','No student was found with the specified payment code or registration number','BUSINESS'),
      ('PEGPAY','Invalid User Credentials','GET_STUDENT_DETAILS',NULL,100,NULL,'PP100','INVALID USER CREDENTIALS','TECHINICAL'),
      ('PEGPAY','Please provide a student number','GET_STUDENT_DETAILS',NULL,99,NULL,'3050','PLEASE PROVIDE A STUDENT NUMBER','BUSINESS'),
      ('SCHOOL_PAY','Request timestamp is expired, check your system clock and timezone','GET_STUDENT_DETAILS',NULL,78001,NULL,'SP78001','Request expired in transit, or clock time shift. Check your system time','TECHINICAL'),
      ('PEGPAY','Please provide a utility code','GET_STUDENT_DETAILS',NULL,103,NULL,'PP103','PLEASE SUPPLY A UTILITY CODE','TECHINICAL'),
      ('SCHOOL_PAY','Request input field is blank','GET_STUDENT_DETAILS',NULL,10101,NULL,'SP10101','Field or input [Digest] cannot be blank','TECHNICAL'),
      ('PEGPAY','Please provide a school code','GET_STUDENT_DETAILS',NULL,100,NULL,'3050','PLEASE PROVIDE SCHOOL CODE','BUSINESS'),
      ('SCHOOL_PAY','Invalid service code','GET_STUDENT_DETAILS',NULL,44010,NULL,'SP44010','Called published service [333] could not be resolved','TECHINICAL'),
      ('SCHOOL_PAY','Request reference already used for an earlier request','GET_STUDENT_DETAILS',NULL,10998,NULL,'SP10998','Request reference [b226d929-6fee-4738-b7a9-b08d2613228192-8-14-20231102050201] was already used for a previous request','TECHINICAL'),
      ('PEGPAY','Invalid vendor code or digital signature','GET_STUDENT_DETAILS',NULL,100,NULL,'PP100-2','INVALID DIGITAL SIGNATURE','TECHINICAL'),
      ('PEGPAY','Vendor code or API key value is missing','GET_STUDENT_DETAILS',NULL,99,NULL,'PP99','INCOMPLETE CREDENTIALS','TECHINICAL'),
      ('PEGPAY','No student matching the provided student number','GET_STUDENT_DETAILS',NULL,100,NULL,'3050','STUDENT NOT FOUND','BUSINESS'),
      ('SCHOOL_PAY','Invalid channel code','GET_STUDENT_DETAILS',NULL,78004,NULL,'SP78004','Channel with code [333] does not exist','TECHINICAL');
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM integrator_error_mapping_entity
    WHERE "receivedErrorDescription" IN (
      'No student was found with the specified payment code or registration number',
      'INVALID USER CREDENTIALS',
      'PLEASE PROVIDE A STUDENT NUMBER',
      'Request expired in transit, or clock time shift. Check your system time',
      'PLEASE SUPPLY A UTILITY CODE',
      'Field or input [Digest] cannot be blank',
      'PLEASE PROVIDE SCHOOL CODE',
      'Called published service [333] could not be resolved',
      'Request reference [b226d929-6fee-4738-b7a9-b08d2613228192-8-14-20231102050201] was already used for a previous request',
      'INVALID DIGITAL SIGNATURE',
      'INCOMPLETE CREDENTIALS',
      'STUDENT NOT FOUND',
      'Channel with code [333] does not exist'
    );
    `);
  }
}
