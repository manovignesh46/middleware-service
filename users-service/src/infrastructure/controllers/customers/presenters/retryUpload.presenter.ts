import { ApiProperty } from '@nestjs/swagger';

export class RetryUpload {
  @ApiProperty()
  imageName: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  retryCount: number;
}

export class RetryUploadPresenter {
  @ApiProperty({ type: RetryUpload })
  front: RetryUpload;

  @ApiProperty({ type: RetryUpload })
  back: RetryUpload;

  @ApiProperty({ type: RetryUpload })
  face: RetryUpload;

  @ApiProperty({ type: RetryUpload })
  selfie: RetryUpload;
}
