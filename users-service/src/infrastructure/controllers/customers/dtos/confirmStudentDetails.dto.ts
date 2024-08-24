import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Gender } from '../../../../domain/enum/gender.enum';

export class ConfirmStudentDetailsDto {
  @IsString()
  @ApiProperty()
  studentId: string;

  @IsString()
  @ApiProperty()
  offerId: string;

  @IsString()
  @ApiProperty()
  studentName: string;

  @IsString()
  @ApiProperty()
  schoolCode: string;

  @IsString()
  @ApiProperty()
  schoolName: string;

  @IsString()
  @ApiProperty()
  studentRegnNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ enum: Gender })
  studentGender: Gender;

  @IsString()
  @IsOptional()
  @ApiProperty()
  studentClass: string;

  @IsNumber()
  @ApiProperty()
  currentOutstandingFee: number;

  @IsString()
  @ApiProperty()
  aggregatorId: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  aggregatorName: string;
}
