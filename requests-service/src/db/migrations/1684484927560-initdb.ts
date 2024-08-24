import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initdb1684484927560 implements MigrationInterface {
  name = 'Initdb1684484927560';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cust_loans_applied" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "applicationId" uuid NOT NULL DEFAULT uuid_generate_v4(), "custId" character varying NOT NULL, "offerId" character varying NOT NULL, "PCOId" character varying NOT NULL, "losLoansBoundaries" character varying NOT NULL, "loanTotalAmount" integer, "loanTenureInstallments" integer, "loanFees" integer, "loanStatus" character varying NOT NULL, "loanInterestAmount" character varying, "loanTotalAmountPayable" integer, "loanRepayFrequecy" character varying, "loanRepayAmount" integer, "loanPreferedPaymentOn" character varying, "loanLastPaymentDate" TIMESTAMP, CONSTRAINT "PK_ce79bcc4f5a1efd36871523ec2f" PRIMARY KEY ("applicationId"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cust_loans_applied"`);
  }
}
