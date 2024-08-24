import { VerifyOtpServiceDto } from '../../infrastructure/controllers/customers/dtos/verifyOtpService.dto';

export abstract class IVerifyOtpService {
  abstract verifyOtp(
    msisdnCountryCode: string,
    msisdn: string,
    otp: string,
  ): Promise<VerifyOtpServiceDto>;
}
