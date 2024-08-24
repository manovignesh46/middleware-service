import { ApiProperty } from '@nestjs/swagger';
import { ScannedDetails } from '../presenters/idCardScan.presenter';

export class CustIdCardDetailsServiceDto {
  @ApiProperty()
  backsideImagePresignedUrl: string;

  @ApiProperty()
  frontsideImagePresignedUrl: string;

  @ApiProperty()
  faceImagePresignedUrl: string;

  @ApiProperty()
  scannedDetails: ScannedDetails;

  @ApiProperty()
  isNINMatched: boolean;
}
