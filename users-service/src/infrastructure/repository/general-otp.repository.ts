import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpAction } from '../../domain/enum/otp-action.enum';
import { IGeneralOtp } from '../../domain/model/general-otp.interface';
import { IGeneralOtpRepository } from '../../domain/repository/general-otp-repository.interface';
import { GeneralOtp } from '../entities/general-otp.entity';

@Injectable()
export class GeneralOtpRepository implements IGeneralOtpRepository {
  constructor(
    @InjectRepository(GeneralOtp)
    private readonly generalOtpRepository: Repository<IGeneralOtp>,
  ) {}
  create(otp: IGeneralOtp): Promise<IGeneralOtp> {
    return this.generalOtpRepository.save(otp);
  }
  async update(otp: IGeneralOtp): Promise<IGeneralOtp> {
    const existingOtp = await this.getById(otp.id);
    return this.generalOtpRepository.save({ ...existingOtp, ...otp });
  }
  getById(id: string): Promise<IGeneralOtp> {
    return this.generalOtpRepository.findOneByOrFail({ id });
  }
  getByCustomerIdAndOtpAction(
    customerId: string,
    otpAction: OtpAction,
  ): Promise<IGeneralOtp> {
    return this.generalOtpRepository.findOneBy({ customerId, otpAction });
  }
}
