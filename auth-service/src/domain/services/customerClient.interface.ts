import { GetCustomerFromFullMsisdnPresenter } from '../../infrastructure/controllers/auth/customer/get-customer-from-full-msisdn.presenter';
import { StatusMessagePresenter } from '../../infrastructure/controllers/common/statusMessage.presenter';
import { OtpAction } from '../enum/otp-action.enum';

export abstract class ICustomerServiceClient {
  abstract createCustomerFromEnhancedLead(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<StatusMessagePresenter>;
  abstract deleteCustomer(customerId: string): Promise<StatusMessagePresenter>;
  abstract updateCustomer(
    customerId: string,
    cognitoId: string,
  ): Promise<StatusMessagePresenter>;
  abstract checkOtpVerifiedKey(
    customerId: string,
    otpVerifiedKey: string,
    otpAction: OtpAction,
  ): Promise<StatusMessagePresenter>;
  abstract getCustomerFromFullMsisdn(
    fullMsisdn: string,
  ): Promise<GetCustomerFromFullMsisdnPresenter>;
  abstract updatePushDevice(
    customerId: string,
    deviceId: string,
    deviceOs: string,
    deviceToken: string,
  ): Promise<StatusMessagePresenter>;
}
