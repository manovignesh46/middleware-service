import { ApiProperty } from '@nestjs/swagger';
import { IBase } from '../../../domain/model/base.interface';

export abstract class BasePresenter implements IBase {
  @ApiProperty()
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
