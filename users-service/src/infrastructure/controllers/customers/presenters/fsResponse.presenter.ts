import { ApiProperty } from '@nestjs/swagger';

export class FSResponsePresenter {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  submittedAt: Date;

  @ApiProperty()
  category: string;

  @ApiProperty()
  subCategory: string;

  @ApiProperty()
  lastUpdatedAt: Date;
}
