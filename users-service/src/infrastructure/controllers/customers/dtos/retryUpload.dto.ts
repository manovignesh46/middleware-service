import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { RetryUploadType } from '../../../../domain/enum/retryUploadType.enum';

export class RetryUploadDTO {
  @IsString()
  @ApiProperty()
  imageName: string;

  @IsEnum(RetryUploadType)
  @ApiProperty({ enum: RetryUploadType })
  type: RetryUploadType;
}
