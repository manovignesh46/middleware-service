import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { IdCardStatus } from '../../domain/enum/id-card-status.enum';
import { ICustPrimaryDetails } from '../../domain/model/custPrimaryDetails.interface';
import { ICustPrimaryDetailsRepository } from '../../domain/repository/custPrimaryDetailsRepository.interface';
import { CustPrimaryDetails } from '../entities/custPrimaryDetails.entity';

@Injectable()
export class CustPrimaryDetailsRepository
  implements ICustPrimaryDetailsRepository
{
  private dbSchema: string;
  private idExpiryDaysList: number[];
  constructor(
    @InjectRepository(CustPrimaryDetails)
    private readonly custPrimaryDetailsRepository: Repository<CustPrimaryDetails>,
    private readonly configService: ConfigService,
  ) {
    this.dbSchema = this.configService.get<string>('DB_SCHEMA') || 'public';
    this.idExpiryDaysList = JSON.parse(
      this.configService.get<string>('ID_EXPIRY_REMINDERS_FREQUENCY_DAYS') ||
        '[180,90,30,5,1]',
    );
  }

  getZeroLoansCust(): Promise<ICustPrimaryDetails[]> {
    return this.custPrimaryDetailsRepository.find({
      where: {
        totalLoans: 0,
      },
    });
  }
  getByEmail(email: string, custId: string): Promise<ICustPrimaryDetails> {
    return this.custPrimaryDetailsRepository.findOne({
      where: {
        email,
        id: Not(custId),
      },
    });
  }
  findByMsisdn(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<ICustPrimaryDetails> {
    return this.custPrimaryDetailsRepository.findOneBy({
      msisdnCountryCode,
      msisdn,
    });
  }
  findByNinMsisdn(
    nationalIdNumber: string,
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<ICustPrimaryDetails> {
    return this.custPrimaryDetailsRepository.findOneBy({
      nationalIdNumber,
      msisdnCountryCode,
      msisdn,
    });
  }
  getByCustomerId(customerId: string): Promise<ICustPrimaryDetails> {
    return this.custPrimaryDetailsRepository.findOneByOrFail({
      id: customerId,
    });
  }

  getCustomerByCustomerId(id: string): Promise<ICustPrimaryDetails> {
    return this.custPrimaryDetailsRepository.findOne({ where: { id } });
  }

  async deleteCustomer(customerId: string): Promise<ICustPrimaryDetails> {
    const customerToDelete =
      await this.custPrimaryDetailsRepository.findOneByOrFail({
        id: customerId,
      });
    if (customerToDelete) {
      return this.custPrimaryDetailsRepository.remove(customerToDelete);
    }
  }
  async getCustomerByLeadId(leadId: string): Promise<ICustPrimaryDetails> {
    return this.custPrimaryDetailsRepository.findOneBy({ leadId });
  }
  create(
    custPrimaryDetails: ICustPrimaryDetails,
  ): Promise<ICustPrimaryDetails> {
    const newCustomer =
      this.custPrimaryDetailsRepository.create(custPrimaryDetails);
    return this.custPrimaryDetailsRepository.save(newCustomer);
  }

  findByNinMsisdnEmail(
    nationalIdNumber: string,
    msisdnCountryCode: string,
    msisdn: string,
    email: string,
  ): Promise<ICustPrimaryDetails[]> {
    if (nationalIdNumber == null) {
      return this.custPrimaryDetailsRepository.find({
        where: [{ msisdnCountryCode, msisdn }, { email }],
      });
    }

    return this.custPrimaryDetailsRepository.find({
      where: [{ nationalIdNumber }, { msisdnCountryCode, msisdn }, { email }],
    });
  }

  async updateCustomer(
    customer: ICustPrimaryDetails,
  ): Promise<ICustPrimaryDetails> {
    return this.custPrimaryDetailsRepository.save(customer);
  }

  async decrementIdExpiryDays(): Promise<void> {
    await this.custPrimaryDetailsRepository.query(
      `UPDATE ${this.dbSchema}.cust_primary_details SET "idExpiryDays" = "idExpiryDays" - 1`,
    );
    return;
  }

  getCustomersByIdExpiryDaysList(): Promise<ICustPrimaryDetails[]> {
    return this.custPrimaryDetailsRepository.find({
      where: { idExpiryDays: In(this.idExpiryDaysList) },
    });
  }

  async setExpiredIdStatus(): Promise<void> {
    await this.custPrimaryDetailsRepository
      .createQueryBuilder()
      .update(CustPrimaryDetails)
      .set({ idStatus: IdCardStatus.EXPIRED })
      .where('"idExpiryDays" <= 0')
      .execute();
    return;
  }
}
