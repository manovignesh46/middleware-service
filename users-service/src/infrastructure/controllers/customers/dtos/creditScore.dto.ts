import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreditScoreDto {
  @IsString()
  @ApiProperty()
  employmentType: string;

  @IsString()
  @ApiProperty()
  activeBankAccount: string;

  @IsString()
  @ApiProperty()
  monthlyGrossIncome: string;

  @IsString()
  @ApiProperty()
  yearsInCurrentPlace: string;

  @IsString()
  @ApiProperty()
  numberOfSchoolKids: string;

  @IsString()
  @ApiProperty()
  maritalStatus: string;

  @IsString()
  @ApiProperty()
  leadId: string;
}
