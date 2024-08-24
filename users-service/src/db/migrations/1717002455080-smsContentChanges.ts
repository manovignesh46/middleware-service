import { MigrationInterface, QueryRunner } from 'typeorm';

export class SmsContentChanges1717002455080 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "UPDATE public.content SET message = 'Dear ${preferredName}. Your application has been declined due to ${rejectionReason} . Thank you for your interest in our products. FURAHA' WHERE \"contentType\" = 'ONBOARDING' AND \"contentName\" = 'ONBOARDING_REJECTED_BY_FURAHA';",
    );
    await queryRunner.query(
      "UPDATE public.content SET message = 'Hello ${preferredName}. The details you provided are incorrect. Please recheck and try again. FURAHA ' WHERE \"contentType\" = 'FORGOT_PIN' AND \"contentName\" = 'FORGOT_PIN_INCORRECT_DETAILS';",
    );
    await queryRunner.query(
      "UPDATE public.content SET message = 'Hello ${preferredName}. Your NIN is about to expire. Obtain replacement to avoid inconviniences.To get new products with us, you will be prompted to scan NIN when it expires. FURAHA ' WHERE \"contentType\" = 'ID' AND \"contentName\" = 'ID_EXPIRING_SOON';",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DELETE FROM public.content WHERE "contentName" = \'ONBOARDING_REJECTED_BY_FURAHA\';',
    );
    await queryRunner.query(
      'DELETE FROM public.content WHERE "contentName" = \'FORGOT_PIN_INCORRECT_DETAILS\';',
    );
    await queryRunner.query(
      'DELETE FROM public.content WHERE "contentName" = \'ID_EXPIRING_SOON\';',
    );
  }
}
