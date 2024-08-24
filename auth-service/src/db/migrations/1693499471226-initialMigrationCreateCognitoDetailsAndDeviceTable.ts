import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigrationCreateCognitoDetailsAndDeviceTable1693499471226
  implements MigrationInterface
{
  name = 'InitialMigrationCreateCognitoDetailsAndDeviceTable1693499471226';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "device" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deviceId" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "cognitoDetailCustomerId" character varying, CONSTRAINT "PK_6fe2df6e1c34fc6c18c786ca26e" PRIMARY KEY ("deviceId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cognito_detail" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "customerId" character varying NOT NULL, "cognitoId" character varying, "msisdnCountryCode" character varying, "msisdn" character varying, CONSTRAINT "PK_b785042031618045453ff777dd1" PRIMARY KEY ("customerId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "FK_1c5d2437be197c67cc53f15dbb2" FOREIGN KEY ("cognitoDetailCustomerId") REFERENCES "cognito_detail"("customerId") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "FK_1c5d2437be197c67cc53f15dbb2"`,
    );
    await queryRunner.query(`DROP TABLE "cognito_detail"`);
    await queryRunner.query(`DROP TABLE "device"`);
  }
}
