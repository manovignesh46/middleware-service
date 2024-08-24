import { ApiProduces, ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { SourceMicroservice } from '../../../domain/model/enum/source-microservice.enum';
import { TargetType } from '../../../domain/model/enum/target-type.enum';

export class SendNotificationDto {
  @IsString()
  @ApiProperty()
  target: string;

  @IsOptional() // Optional For now as we only send SMS
  @ApiProperty({ enum: TargetType, required: false })
  targetType: TargetType;

  @IsString()
  @IsOptional()
  @ApiProperty()
  messageHeader: string;

  @IsString()
  @ApiProperty()
  message: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  customerId: string;

  @IsString()
  @ApiProperty({ enum: SourceMicroservice })
  sourceMicroservice: SourceMicroservice;

  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  priority: number;
}
