import { ApiProperty } from '@nestjs/swagger';

export class FAQdto {
  @ApiProperty()
  faq: string;

  @ApiProperty()
  ans: string;
}

export class FAQPresenter {
  @ApiProperty({ type: FAQdto })
  faqs: any;
}
