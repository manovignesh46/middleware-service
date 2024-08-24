import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Not, Repository } from 'typeorm';
import { LeadStatus } from '../../domain/enum/leadStatus.enum';
import { ICustOtp } from '../../domain/model/custOtp.interface';
import { ICustOtpRepository } from '../../domain/repository/custOtpRepository.interface';
import { CustOtp } from '../entities/custOtp.entity';

@Injectable()
export class CustOtpRepository implements ICustOtpRepository {
  constructor(
    @InjectRepository(CustOtp)
    private readonly custOtpRepository: Repository<ICustOtp>,
  ) {}

  updateCustOtpList(custOtpList: ICustOtp[]): Promise<ICustOtp[]> {
    return this.custOtpRepository.save(custOtpList);
  }

  findLeadForPurging(purgingHour: number): Promise<ICustOtp[]> {
    const thresholdDate: Date = new Date();
    thresholdDate.setHours(thresholdDate.getHours() - purgingHour);
    return this.custOtpRepository.find({
      where: {
        isTerminated: true,
        leadCurrentStatus: Not(LeadStatus.LEAD_ONBOARDED),
        updatedAt: LessThanOrEqual(thresholdDate),
      },
    });
  }

  findLeadByExReqIdApprovalIdFullMsisdn(
    mtnOptInReqId: string,
    mtnApprovalId: string,
    fullMsisdn: string,
  ): Promise<ICustOtp> {
    return this.custOtpRepository
      .createQueryBuilder('cust_otp')
      .where(
        `CONCAT(cust_otp.msisdnCountryCode, cust_otp.msisdn) = :fullMsisdn
        AND cust_otp.mtnOptInReqId = :mtnOptInReqId
        AND cust_otp.mtnApprovalId = :mtnApprovalId
         AND cust_otp.isTerminated = :isTerminated`,
        {
          fullMsisdn,
          mtnOptInReqId,
          mtnApprovalId,
          isTerminated: false,
        },
      )
      .getOne();
  }
  findLeadByMsisdnApprovalId(
    msisdnCountryCode: string,
    msisdn: string,
    mtnApprovalId: string,
  ): Promise<ICustOtp> {
    return this.custOtpRepository.findOne({
      where: {
        msisdn,
        msisdnCountryCode,
        mtnApprovalId,
        isTerminated: false,
      },
    });
  }
  findLeadByFullMsisdnConcat(fullMsisdn: string): Promise<ICustOtp> {
    return this.custOtpRepository
      .createQueryBuilder('cust_otp')
      .where(
        `CONCAT(cust_otp.msisdnCountryCode, cust_otp.msisdn) = :fullMsisdn AND cust_otp.isTerminated = :isTerminated`,
        {
          fullMsisdn,
          isTerminated: false,
        },
      )
      .getOne();
  }

  create(lead: ICustOtp): Promise<ICustOtp> {
    const newLead = this.custOtpRepository.create(lead);
    return this.custOtpRepository.save(newLead);
  }
  getAll(): Promise<ICustOtp[]> {
    return this.custOtpRepository.find();
  }
  getById(id: string): Promise<ICustOtp> {
    return this.custOtpRepository.findOneByOrFail({
      leadId: id,
      isTerminated: false,
    });
  }
  getByMsisdn(msisdnCountryCode: string, msisdn: string): Promise<ICustOtp> {
    return this.custOtpRepository.findOneOrFail({
      where: { msisdnCountryCode, msisdn, isTerminated: false },
      order: { createdAt: 'DESC' },
    });
  }
  async update(lead: ICustOtp): Promise<ICustOtp> {
    const currentLead = await this.getById(lead.leadId);
    return this.custOtpRepository.save({ ...currentLead, ...lead });
  }

  findNonOnboardedLead(): Promise<ICustOtp[]> {
    return this.custOtpRepository.find({
      where: {
        isTerminated: false,
        leadCurrentStatus: Not(LeadStatus.LEAD_ONBOARDED),
      },
    });
  }

  findLeadByNinMsisdnEmail(
    nationalIdNumber: string,
    msisdnCountryCode: string,
    msisdn: string,
    email: string, //email is no longer colleted therefore we don't search by it
  ): Promise<ICustOtp[]> {
    // Only return WIP hit if entry has isTerminated = false

    if (nationalIdNumber == null) {
      return this.custOtpRepository.find({
        where: [{ msisdnCountryCode, msisdn, isTerminated: false }],
      });
    }

    return this.custOtpRepository.find({
      where: [
        { nationalIdNumber, isTerminated: false },
        { msisdnCountryCode, msisdn, isTerminated: false },
      ],
    });
  }
}
