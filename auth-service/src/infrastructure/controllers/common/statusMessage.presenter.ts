import { ApiProperty } from '@nestjs/swagger';

export class StatusMessagePresenter<T = any> {
  @ApiProperty({ type: Number, example: 2000 })
  status: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  data: T;

  constructor(status: number, message: string, data?: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
