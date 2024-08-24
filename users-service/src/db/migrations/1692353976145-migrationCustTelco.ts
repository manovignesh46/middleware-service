import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationCustTelco1692353976145 implements MigrationInterface {
  name = 'MigrationCustTelco1692353976145';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_telco" DROP CONSTRAINT "PK_c9e79db3d20b450c9250db8c84a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" DROP COLUMN "kycCheckId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" RENAME COLUMN "leadId" TO "idValue"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ADD CONSTRAINT "PK_eac330a29d6762e619702076924" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ADD "idType" character varying DEFAULT 'LEAD'`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ADD "givenName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ADD "gender" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ADD "msisdnCountryCode" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ADD "dob" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ADD "registrationDate" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ADD "nationality" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ADD "isDataSentToLOS" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ALTER COLUMN "lastName" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ALTER COLUMN "middleName" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ALTER COLUMN "isBarred" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ALTER COLUMN "registrationType" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ALTER COLUMN "registrationType" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ALTER COLUMN "isBarred" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ALTER COLUMN "middleName" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ALTER COLUMN "lastName" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" DROP COLUMN "isDataSentToLOS"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" DROP COLUMN "nationality"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" DROP COLUMN "registrationDate"`,
    );
    await queryRunner.query(`ALTER TABLE "cust_telco" DROP COLUMN "dob"`);
    await queryRunner.query(
      `ALTER TABLE "cust_telco" DROP COLUMN "msisdnCountryCode"`,
    );
    await queryRunner.query(`ALTER TABLE "cust_telco" DROP COLUMN "gender"`);
    await queryRunner.query(`ALTER TABLE "cust_telco" DROP COLUMN "givenName"`);
    await queryRunner.query(`ALTER TABLE "cust_telco" DROP COLUMN "idType"`);
    await queryRunner.query(
      `ALTER TABLE "cust_telco" DROP CONSTRAINT "PK_eac330a29d6762e619702076924"`,
    );
    await queryRunner.query(`ALTER TABLE "cust_telco" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "cust_telco" RENAME COLUMN "idValue" TO "leadId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ADD "kycCheckId" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_telco" ADD CONSTRAINT "PK_c9e79db3d20b450c9250db8c84a" PRIMARY KEY ("kycCheckId")`,
    );
  }
}
