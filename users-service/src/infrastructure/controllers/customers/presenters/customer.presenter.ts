import { ApiProperty } from '@nestjs/swagger';
import { LoanStatus } from '../../../../domain/enum/loanStatus.enum';
import { ICustPrimaryDetails } from '../../../../domain/model/custPrimaryDetails.interface';

export class CreateCustPrimaryDetailsPresenter {
  @ApiProperty()
  id: string;
  constructor(custPrimaryDetails: ICustPrimaryDetails) {
    this.id = custPrimaryDetails.id;
  }
}

// export class SanctionedUserPresenter {
//   @ApiProperty()
//   id: string;

//   @ApiProperty()
//   firstName: string;

//   @ApiProperty()
//   lastName: string;

//   @ApiProperty()
//   status: string;

//   @ApiProperty()
//   createdAt: string;

//   @ApiProperty()
//   updatedAt: string;

//   constructor(user: any) {
//     this.id = user.id;
//     this.firstName = user.firstName;
//     this.lastName = user.lastName;
//     this.status = user.status;
//     this.createdAt = user.createdAt;
//     this.updatedAt = user.updatedAt;
//   }
// }

export class LoanPresenter {
  @ApiProperty()
  productType: string;

  @ApiProperty()
  studentName: string;

  @ApiProperty()
  dueDate: string;

  @ApiProperty()
  loanAmount: string;
}

export class CustomerLoanPresenter {
  @ApiProperty({ type: [LoanPresenter] })
  summary: LoanPresenter[];

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  loanId: string;

  @ApiProperty()
  customerId: string;

  @ApiProperty()
  lastTransactionDate: string;

  @ApiProperty({ enum: ['ACTIVE', 'INACTIVE'] })
  status: LoanStatus;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;
}
