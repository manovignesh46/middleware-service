import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAppliationDeclinedMessageContent1706156145321
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO public.content ("contentName", "contentType", "messageHeader", "message", "messageType") VALUES(\'ONBOARDING_REJECTED_BY_FURAHA\', \'ONBOARDING\', \'FURAHA - Your application was not successful\', \'Dear ${preferredName}, your application has been declined due to ${rejectionReason}. Thank you for your interest in our products.\', \'text\');',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DELETE FROM public.content WHERE "contentName" = \'ONBOARDING_REJECTED_BY_FURAHA\';',
    );
  }
}
