import { IsInt, IsOptional, IsString } from 'class-validator';
import { SourceMicroservice } from '../enum/source-microservice.enum';
import { TargetType } from '../enum/target-type.enum';

export class SendNotificationDto {
  @IsString()
  target: string;

  @IsOptional() // Optional For now as we only send SMS
  targetType: TargetType;

  @IsString()
  messageHeader: string;

  @IsString()
  message: string;

  @IsString()
  customerId: string;

  @IsString()
  sourceMicroservice: SourceMicroservice;

  @IsInt()
  @IsOptional()
  priority: number;
}
