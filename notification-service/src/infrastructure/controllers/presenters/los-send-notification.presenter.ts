import { ApiProperty } from '@nestjs/swagger';

export class LOSSendNotificationPresenter {
  @ApiProperty()
  status: number;

  @ApiProperty()
  txn_id: string;

  @ApiProperty()
  notification_ref_number: string;
}
