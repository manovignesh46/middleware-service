import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSocioEconomicFactors1688564310418
  implements MigrationInterface
{
  name = 'UpdateSocioEconomicFactors1688564310418';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_scoring_data" DROP COLUMN "numberOfDependents"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_scoring_data" DROP COLUMN "typeOfHouse"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_scoring_data" DROP COLUMN "educationLevel"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_scoring_data" ADD "monthlyGrossIncome" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_scoring_data" ADD "activeBankAccount" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_scoring_data" ADD "yearsInCurrentPlace" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_scoring_data" ADD "numberOfSchoolKids" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cust_scoring_data" DROP COLUMN "numberOfSchoolKids"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_scoring_data" DROP COLUMN "yearsInCurrentPlace"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_scoring_data" DROP COLUMN "activeBankAccount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_scoring_data" DROP COLUMN "monthlyGrossIncome"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_scoring_data" ADD "educationLevel" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_scoring_data" ADD "typeOfHouse" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cust_scoring_data" ADD "numberOfDependents" integer NOT NULL`,
    );
  }
}
