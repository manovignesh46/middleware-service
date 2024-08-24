import { IsString } from 'class-validator';
import { PushStatusType } from '../../../domain/enum/pushStatus.enum';
import { ApiProperty } from '@nestjs/swagger';

export class PushStatusDTO {
  @IsString()
  @ApiProperty()
  pushId: string;

  @IsString()
  @ApiProperty({ enum: PushStatusType })
  pushStatus: PushStatusType;
}
