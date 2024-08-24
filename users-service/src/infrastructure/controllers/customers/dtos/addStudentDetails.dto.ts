import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Gender } from '../../../../domain/enum/gender.enum';

export class AddStudentDetailsDTO {
  @IsString()
  @ApiProperty()
  studentId: string;

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
  @ApiProperty({ enum: Gender })
  studentGender: Gender;

  @IsString()
  @IsOptional()
  @ApiProperty()
  studentClass: string;

  @IsString()
  @ApiProperty()
  aggregatorId: string;

  @IsNumber()
  @ApiProperty()
  aggregatorIdNumber: number;
}
