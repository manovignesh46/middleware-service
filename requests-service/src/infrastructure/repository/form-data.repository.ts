import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IFormData } from '../../domain/model/form-data.interface';
import { IFormDataRepository } from '../../domain/repository/form-data.repository.interface';
import { FormData } from '../entities/form-data.entity';

@Injectable()
export class FormDataRepository implements IFormDataRepository {
  constructor(
    @InjectRepository(FormData)
    private formDataRepository: Repository<FormData>,
  ) {}

  getByCustIdLoanIdAndTypeId(
    customerId: string,
    loanId: string,
    typeId: string,
  ): Promise<IFormData> {
    return this.formDataRepository.findOne({
      where: {
        customerId,
        loanId,
        typeId,
      },
    });
  }
  create(form: IFormData): Promise<IFormData> {
    return this.formDataRepository.save(form);
  }
  async update(form: IFormData): Promise<IFormData> {
    const existingForm = await this.getById(form.id);
    return this.formDataRepository.save({ ...existingForm, ...form });
  }
  getById(id: string): Promise<IFormData> {
    return this.formDataRepository.findOneByOrFail({ id });
  }
  getByCustomerId(customerId: string): Promise<IFormData> {
    return this.formDataRepository.findOneBy({ customerId });
  }
  getByFullMsisdn(fullMsisdn: string): Promise<IFormData> {
    return this.formDataRepository.findOneBy({ fullMsisdn });
  }
}
