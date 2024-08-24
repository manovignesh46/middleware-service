import { MigrationInterface, QueryRunner } from 'typeorm';

export class GeneralOtpTable1690942917438 implements MigrationInterface {
  name = 'GeneralOtpTable1690942917438';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "general_otp" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customerId" character varying NOT NULL, "otpValue" character varying NOT NULL, "otpAction" character varying NOT NULL, "fullMsisdn" character varying NOT NULL, "failedAttempts" bigint NOT NULL, "expiredAt" TIMESTAMP WITH TIME ZONE NOT NULL, "sentAt" TIMESTAMP WITH TIME ZONE, "lockedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_8cad1fbec62599c11793d47932b" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "general_otp"`);
  }
}
