import { ApiProduces, ApiProperty } from '@nestjs/swagger';
import { OfferDetail } from './dashBoard.presenter';

export class ConfirmStudentDetailsPresenter {
  @ApiProperty()
  studentPCOId: string;

  @ApiProperty()
  minLoanAmount: number;

  @ApiProperty()
  maxLoanAmount: number;

  @ApiProperty({ type: OfferDetail })
  offersDetail: OfferDetail;
}
