import { ApiProperty } from '@nestjs/swagger';

export class EKycPresenter {
  @ApiProperty()
  telcoIdMatch: boolean;

  @ApiProperty()
  sanctionCheck: boolean;

  @ApiProperty()
  scanIdCheck: string;

  @ApiProperty()
  scanNameCheck: string;

  @ApiProperty()
  idExpiry: string;

  @ApiProperty()
  photoMatch: number;
}
