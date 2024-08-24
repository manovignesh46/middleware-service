import { MigrationInterface, QueryRunner } from 'typeorm';

export class FsSupportTables1700074147526 implements MigrationInterface {
  name = 'FsSupportTables1700074147526';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cust_fs_registration" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "custId" character varying NOT NULL, "custCountryCode" character varying NOT NULL, "custMsisdn" character varying NOT NULL, "primaryEmail" character varying NOT NULL, "fsRequesterId" integer NOT NULL, "fsIsActive" boolean NOT NULL, CONSTRAINT "PK_e6e1768815db83cb0c9282387c0" PRIMARY KEY ("custId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cust_ticket_details" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "submittedId" uuid NOT NULL DEFAULT uuid_generate_v4(), "custId" character varying NOT NULL, "custCountryCode" character varying NOT NULL, "custMsisdn" character varying NOT NULL, "tktType" character varying NOT NULL, "tktSubject" text NOT NULL, "tktDescription" text NOT NULL, "tktCategory" text NOT NULL, "tktSubCategory" text NOT NULL, "hasAttachments" boolean NOT NULL, "attachmentsCount" integer NOT NULL, "attachmentsFilenames" character varying NOT NULL, "isSentToFs" boolean NOT NULL, "sentToFsAt" TIMESTAMP NOT NULL, "respHttpStatusCode" integer NOT NULL, "respErrorBody" text NOT NULL, "tktRequesterId" integer NOT NULL, "tktRequestedForId" integer NOT NULL, "ticketId" integer NOT NULL, "tktAttachmentsDetails" character varying NOT NULL, "tktStatus" character varying NOT NULL, "tktCreatedAt" TIMESTAMP NOT NULL, "tktUpdatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_7c80e66bd07973df8eaa1006b44" PRIMARY KEY ("submittedId"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cust_ticket_details"`);
    await queryRunner.query(`DROP TABLE "cust_fs_registration"`);
  }
}
