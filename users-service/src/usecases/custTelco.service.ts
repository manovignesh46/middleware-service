import { Injectable, Logger } from '@nestjs/common';
import { ICustTelcoRepository } from '../domain/repository/custTelcoRepository.interface';
import { ICustTelcoService } from '../domain/services/custTelcoService.interface';
import { ICustTelco } from '../domain/model/custTelco.interface';

@Injectable()
export class CustTelcoService implements ICustTelcoService {
  constructor(private readonly custRepository: ICustTelcoRepository) {}

  private readonly logger = new Logger(CustTelcoService.name);

  findCustTelco(leadId: string): Promise<ICustTelco> {
    this.logger.log(this.findCustTelco.name);
    return this.custRepository.findByLeadId(leadId);
  }

  save(custTelco: ICustTelco): Promise<ICustTelco> {
    return this.custRepository.save(custTelco);
  }
}
