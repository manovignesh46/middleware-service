import { ISMSLog } from '../model/smsLog.interface';

export abstract class ISMSLogRepository {
  abstract save(smsLog: ISMSLog): Promise<ISMSLog>;
}
