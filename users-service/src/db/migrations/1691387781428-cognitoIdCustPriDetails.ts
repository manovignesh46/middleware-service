import { MigrationInterface, QueryRunner } from 'typeorm';

export class CognitoIdCustPriDetails1691387781428
  implements MigrationInterface
{
  name = 'CognitoIdCustPriDetails1691387781428';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" ADD "cognitoId" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_primary_details" DROP COLUMN "cognitoId"`,
    );
  }
}
