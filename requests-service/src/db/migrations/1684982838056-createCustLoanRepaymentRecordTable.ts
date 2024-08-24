import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustLoanRepaymentRecordTable1684982838056
  implements MigrationInterface
{
  name = 'CreateCustLoanRepaymentRecordTable1684982838056';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cust_loan_repayment_record" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "customerId" character varying NOT NULL, "offerId" integer NOT NULL, "loanAccountNumber" integer NOT NULL, "loanTotalAmount" integer, "loanDueAmount" integer, "loanDueDate" TIMESTAMP WITH TIME ZONE, "loanDueStatus" character varying, "loanRepaymentType" character varying, "loanRepaymentAmount" integer NOT NULL, "loanRepaymentMode" character varying, "loanRepaymentStatus" character varying NOT NULL, "loanRepaymentResponse" character varying, CONSTRAINT "PK_88c928d62a04103b116885b9a47" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "cust_loan_repayment_record"`);
  }
}
