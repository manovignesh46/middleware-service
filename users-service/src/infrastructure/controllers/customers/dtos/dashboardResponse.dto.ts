import { ApiProperty } from '@nestjs/swagger';
import { DashBoardPresenter } from '../presenters/dashBoard.presenter';

export class DashboardResponseDTO {
  @ApiProperty()
  dashBoardPresenter: DashBoardPresenter;

  @ApiProperty()
  rejectionReason: string;

  @ApiProperty()
  rejectionCode: number;

  @ApiProperty()
  applicationStatus: string;
}
