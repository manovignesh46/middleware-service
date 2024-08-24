import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContentForIDExpiringSoonMsg1705475384027
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO public.content ("contentName", "contentType", "messageHeader", "message", "messageType") VALUES(\'ID_EXPIRING_SOON\', \'ID\', \'FURAHA - Your ID is due to expire\', \'Hello ${preferredName}. Your NIN is about to expire. Update soon from your Furaha mobile App to continue enjoying our products\', \'text\');',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DELETE FROM public.content WHERE "contentName" = \'ID_EXPIRING_SOON\';',
    );
  }
}
