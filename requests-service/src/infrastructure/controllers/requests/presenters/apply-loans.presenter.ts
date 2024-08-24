import { ApiProperty } from '@nestjs/swagger';

export class OfferDetail {
  @ApiProperty()
  offerId: string;

  @ApiProperty()
  offerName: string;

  @ApiProperty()
  offerDescription: string;

  @ApiProperty()
  offerImage: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  moreDetails: any;
}

export class ApplyLoansPresenter {
  @ApiProperty()
  studentPCOId: string;

  @ApiProperty()
  minLoanAmount: number;

  @ApiProperty()
  maxLoanAmount: number;

  @ApiProperty({ type: OfferDetail })
  offersDetail: OfferDetail;
}
