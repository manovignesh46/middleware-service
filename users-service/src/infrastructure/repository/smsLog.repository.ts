import { Injectable } from '@nestjs/common';
import { ISMSLog } from '../../domain/model/smsLog.interface';
import { ISMSLogRepository } from '../../domain/repository/smsLogRepository.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SMSLog } from '../entities/smsLog.entity';

@Injectable()
export class SMSLogRepository implements ISMSLogRepository {
  constructor(
    @InjectRepository(SMSLog)
    private readonly smsLogRepository: Repository<ISMSLog>,
  ) {}

  save(smsLog: ISMSLog): Promise<ISMSLog> {
    return this.smsLogRepository.save(smsLog);
  }
}
