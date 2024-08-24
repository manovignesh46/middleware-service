import { Type } from 'class-transformer';
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { AddressType } from '../../../../domain/enum/address-type.enum';
import { CountryCodes } from '../../../../domain/enum/country-code.enum';
import 'reflect-metadata';
import { ApiProperty } from '@nestjs/swagger';

export class ScannedAddress {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  village: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  parish: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  subCountry: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  county: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  district: string;

  @IsEnum(CountryCodes)
  @ValidateIf((dto) => dto.countryOfResidence !== '')
  @IsOptional()
  @ApiProperty({ enum: CountryCodes, required: false })
  countryOfResidence: CountryCodes;

  @IsEnum(AddressType)
  @ValidateIf((dto) => dto.addressType !== '')
  @IsOptional()
  @ApiProperty({ enum: AddressType })
  addressType: AddressType;
}

export class OCR {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  givenName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  surname: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  nin: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  dob: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  ninExpiryDate: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type()
  @ApiProperty({ type: ScannedAddress, required: false })
  address: ScannedAddress;
}

export class MRZ {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  givenName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  surname: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  nin: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  dob: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  ninExpiryDate: string;
}

export class Edited {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  givenName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  surname: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  nin: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  dob: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  ninExpiryDate: string;
}

export class Image {
  @IsString()
  @IsOptional()
  fileName: string;

  @IsString()
  @IsOptional()
  content: string;
}

export class IdCardScanDTO {
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type()
  @ApiProperty({ type: OCR, required: false })
  ocr: OCR;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type()
  @ApiProperty({ type: MRZ, required: false })
  mrz: MRZ;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  backsideImageName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  frontsideImageName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  faceImageName: string;
}
export class EditIdCardScanDTO {
  @IsObject()
  @IsOptional()
  @ApiProperty({ type: Edited, required: false })
  edited: Edited;
}
