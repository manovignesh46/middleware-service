import { ApiProperty } from '@nestjs/swagger';

export class TargetApiUuidPresenter {
  @ApiProperty()
  targetApiUuid: string;
}
