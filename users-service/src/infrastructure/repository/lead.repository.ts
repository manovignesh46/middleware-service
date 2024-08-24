// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { ILead } from '../../domain/model/lead.interface';
// import { ILeadRepository as ILeadsRepository } from '../../domain/repository/lead.repository.interface';
// import { WipDedupeError } from '../controllers/common/errors/wipDedupe.error';
// import { Lead } from '../entities/lead.entity';

// @Injectable()
// export class LeadsRepository implements ILeadsRepository {
//   constructor(
//     @InjectRepository(Lead) private readonly leadRepository: Repository<ILead>,
//   ) {}
//   async wipDedupeCheck(
//     nationalIdNumber: string,
//     msisdn: string,
//     msisdnCountryCode: string,
//     email: string,
//   ): Promise<ILead[]> {
//     const existingLeads: ILead[] = await this.leadRepository.find({
//       where: [{ nationalIdNumber }, { msisdn, msisdnCountryCode }, { email }],
//       order: { createdAt: 'DESC' },
//     });

//     //no existing lead
//     if (existingLeads.length === 0) {
//       return existingLeads;
//     }

//     // existing lead, email matches
//     else if (existingLeads.length === 1 && existingLeads[0].email === email) {
//       return existingLeads;
//     }

//     //existing lead, email needs update
//     else if (existingLeads.length === 1 && existingLeads[0].email !== email) {
//       const updatedLead = await this.update({ ...existingLeads[0], email });
//       return Array.of(updatedLead);
//     }

//     //more than one lead with same nin, msisdn and msisdnCountryCode
//     else if (existingLeads.length > 1) {
//       throw new WipDedupeError(
//         'Multiple leads with same NIN, msisdn and msisdnCountryCode',
//       );
//     }
//   }
//   create(lead: ILead): Promise<ILead> {
//     const newLead = this.leadRepository.create(lead);
//     return this.leadRepository.save(newLead);
//   }
//   getAll(): Promise<ILead[]> {
//     return this.leadRepository.find();
//   }
//   getById(id: string): Promise<ILead> {
//     return this.leadRepository.findOneById(id);
//   }
//   getByMsisdn(msisdn: string, msisdnCountryCode: string): Promise<ILead> {
//     return this.leadRepository.findOneOrFail({
//       where: { msisdn, msisdnCountryCode },
//       order: { createdAt: 'DESC' },
//     });
//   }
//   async update(lead: ILead): Promise<ILead> {
//     const currentLead = await this.getById(lead.leadId);
//     return this.leadRepository.save({ ...currentLead, ...lead });
//   }
// }
