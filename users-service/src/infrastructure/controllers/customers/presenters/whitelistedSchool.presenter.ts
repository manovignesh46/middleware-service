import { ApiProperty } from '@nestjs/swagger';

export class WhitelistedSchoolLabel {
  @ApiProperty()
  label: string;

  @ApiProperty()
  value: string;
}
export class WhitelistedSchoolPresenter {
  @ApiProperty({ isArray: true, type: WhitelistedSchoolLabel })
  whitelistedSchools: WhitelistedSchoolLabel[];
}
