import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsBooleanString,
  IsOptional,
  IsString,
} from 'class-validator';

export class SubmitTicketDTO {
  @ApiProperty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  subCategory: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  fullMsisdn: string;

  @ApiProperty()
  @IsBooleanString()
  hasAttachments: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  attachmentFilenames: string[];
}
