import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCustomerDto {
  @IsString()
  @ApiProperty()
  customerId: string;

  @IsString()
  @ApiProperty()
  cognitoId: string;
}
