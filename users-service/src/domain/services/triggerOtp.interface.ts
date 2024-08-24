import { MTNApprovalPollingDTO } from '../../infrastructure/controllers/customers/dtos/mtnApprovalPolling.dto';
import { MTNApprovalServiceDTO } from '../../infrastructure/controllers/customers/dtos/mtnApprovalService.dto';
import { TriggerOtpDto } from '../../infrastructure/controllers/customers/dtos/triggerOtp.dto';
import { TriggerOtpServiceDto } from '../../infrastructure/controllers/customers/dtos/triggerOtpService.dto';

export abstract class ITriggerOtpService {
  abstract triggerOtp(
    triggerOtpDto: TriggerOtpDto,
  ): Promise<TriggerOtpServiceDto>;
  abstract resumeAction(
    msisdn: string,
    msisdnCountryCode: string,
  ): Promise<TriggerOtpServiceDto>;

  abstract mtnApprovalPolling(
    mtnApporvalPollingDTO: MTNApprovalPollingDTO,
  ): Promise<MTNApprovalServiceDTO>;
}
