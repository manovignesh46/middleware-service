import { OtpAction } from '../enum/otp-action.enum';
import { IGeneralOtp } from '../model/general-otp.interface';

export abstract class IGeneralOtpRepository {
  abstract create(otp: IGeneralOtp): Promise<IGeneralOtp>;
  abstract update(otp: IGeneralOtp): Promise<IGeneralOtp>;
  abstract getById(id: string): Promise<IGeneralOtp>;
  abstract getByCustomerIdAndOtpAction(
    customerId: string,
    otpAction: OtpAction,
  ): Promise<IGeneralOtp>;
}
