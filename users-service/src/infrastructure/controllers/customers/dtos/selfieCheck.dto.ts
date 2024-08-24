import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class SelfieCheckDTO {
  @IsNumber()
  @ApiProperty()
  faceMatchScore: number;

  @IsNumber()
  @ApiProperty()
  livenessScore: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  selfieImageName: string;
}
