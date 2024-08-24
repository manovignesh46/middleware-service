import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RetrieveStudentDetailsDto {
  @IsString()
  @ApiProperty()
  aggregatorId: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  schoolCode: string;

  @IsString()
  @ApiProperty()
  studentRegnNumber: string;

  @IsString()
  @ApiProperty()
  msisdn: string;
}

export class SchoolAggregatorGetStudentDetailsRequestDto {
  constructor(public studentRegnNumber: string, public schoolCode: string) {}
}

export class RetrieveSchoolPayStudentDetailsDto extends SchoolAggregatorGetStudentDetailsRequestDto {
  constructor(
    public studentRegnNumber: string,
    public schoolCode: string,
    public requestReference,
  ) {
    super(studentRegnNumber, schoolCode);
  }
}

export class RetrievePegPayStudentDetailsDto extends SchoolAggregatorGetStudentDetailsRequestDto {}
