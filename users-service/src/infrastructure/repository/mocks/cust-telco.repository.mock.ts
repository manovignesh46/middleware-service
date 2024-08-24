import { IdType } from '../../../domain/enum/id-type.enum';
import { ICustTelco } from '../../../domain/model/custTelco.interface';
import { mockCustTelco } from '../../../domain/model/mocks/cust-telco.mock';
import { ICustTelcoRepository } from '../../../domain/repository/custTelcoRepository.interface';

export const mockCustTelcoRepository: ICustTelcoRepository = {
  findByLeadId: function (leadId: string): Promise<ICustTelco> {
    return Promise.resolve({
      ...mockCustTelco,
      idType: IdType.LEAD,
      idValue: leadId,
    });
  },
  save: function (custTelco: ICustTelco): Promise<ICustTelco> {
    return Promise.resolve(custTelco);
  },
  findByFullMsisdnAndLeadId: function (
    msisdnCountryCode: string,
    msisdn: string,
    leadId: string,
  ): Promise<ICustTelco> {
    return Promise.resolve(mockCustTelco);
  },
  findByLeadIdList: function (leadIdList: string[]): Promise<ICustTelco[]> {
    throw new Error('Function not implemented.');
  },
  updateCustTelcoList: function (
    custTelco: ICustTelco[],
  ): Promise<ICustTelco[]> {
    throw new Error('Function not implemented.');
  },
};
