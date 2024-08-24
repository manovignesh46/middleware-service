import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: '+256' })
  @IsString()
  msisdnCountryCode: string;

  @ApiProperty({ example: '999999999' })
  @IsString()
  msisdn: string;

  @ApiProperty({ example: '123456' })
  @IsNumberString()
  @MaxLength(6)
  @MinLength(6)
  pin: string;

  @ApiProperty({ example: '123456' })
  @IsNumberString()
  @MaxLength(6)
  @MinLength(6)
  confirmPin: string;

  @ApiProperty({ example: 'abc@abc.com' })
  @ValidateIf((dto) => dto.email !== '')
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsString()
  @IsOptional()
  deviceName: string;
}

export class LoginDto {
  @ApiProperty({ example: '+256' })
  @IsString()
  msisdnCountryCode: string;

  @ApiProperty({ example: '999999999' })
  @IsString()
  msisdn: string;

  @ApiProperty({ example: '123456' })
  @IsNumberString()
  @MaxLength(6)
  @MinLength(6)
  pin: string;

  @IsString()
  @IsNotEmpty()
  deviceId: string;
}

export class VerifyLoginOtpDto {
  @ApiProperty()
  @IsString()
  sessionId: string;

  @ApiProperty()
  @IsString()
  msisdnCountryCode: string;

  @ApiProperty()
  @IsString()
  msisdn: string;

  @ApiProperty()
  @IsString()
  otp: string;

  @ApiProperty()
  @IsOptional() //ToDo Make this Mandatory
  deviceId: string;

  @ApiProperty()
  @IsOptional() //ToDo Make this Mandatory
  deviceOs: string;

  @ApiProperty()
  @IsOptional() //ToDo Make this Mandatory
  deviceToken: string;
}

export class ResetPinDto {
  @ApiProperty()
  @MaxLength(6)
  @MinLength(6)
  @IsNumberString()
  currentPin: string;

  @ApiProperty()
  @MaxLength(6)
  @MinLength(6)
  @IsNumberString()
  newPin: string;

  @ApiProperty()
  @MaxLength(6)
  @MinLength(6)
  @IsNumberString()
  confirmNewPin: string;
}

export class LogoutDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}
