import { ICustOtp } from '../../../../domain/model/custOtp.interface';

export class MTNApprovalServiceDTO {
  constructor(
    public custOtp: ICustOtp,
    public validationFailed: boolean,
    public validationNotAvaiable: boolean,
  ) {}
}
