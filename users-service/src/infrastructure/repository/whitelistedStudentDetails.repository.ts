import { Injectable } from '@nestjs/common';
import { IWhitelistedStudentDetails } from '../../domain/model/whitelistedStudentDetails.interface';
import { IWhitelistedStudentDetailsRepository } from '../../domain/repository/whitelistedStudentDetailsRepository.interface';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WhitelistedStudentDetails } from '../entities/whitelistedStudentDetails.entity';
import { WhitelistStatus } from '../../domain/enum/whitelistStatus.enum';

@Injectable()
export class WhitelistedStudentDetailsRepository
  implements IWhitelistedStudentDetailsRepository
{
  constructor(
    @InjectRepository(WhitelistedStudentDetails)
    private readonly whitelistedStudentDetailsRepository: Repository<IWhitelistedStudentDetails>,
  ) {}
  findByRegNumberInPaymentCode(
    leadId: string,
    regNumber: string,
  ): Promise<IWhitelistedStudentDetails> {
    return this.whitelistedStudentDetailsRepository.findOne({
      where: [
        {
          leadId,
          studentSchoolRegnNumber: regNumber,
        },
        {
          leadId,
          studentPaymentCode: regNumber,
        },
      ],
    });
  }

  findByPaymentCodeInRegNumber(
    leadId: string,
    paymentCode: string,
  ): Promise<IWhitelistedStudentDetails> {
    return this.whitelistedStudentDetailsRepository.findOne({
      where: [
        {
          leadId,
          studentSchoolRegnNumber: paymentCode,
        },
        {
          leadId,
          studentPaymentCode: paymentCode,
        },
      ],
    });
  }

  findStudentByLeadIdAndStudentRegNumberAndSchoolCode(
    leadId: string,
    studentSchoolRegnNumber: string,
    studentSchoolCode: string,
  ): Promise<IWhitelistedStudentDetails> {
    return this.whitelistedStudentDetailsRepository.findOne({
      where: {
        leadId,
        studentSchoolRegnNumber,
        studentSchoolCode,
        isStudentDeleted: false,
        currentStatus: In(['WHITELISTING', 'ADDED', 'UPDATED']),
      },
    });
  }

  findStudentByLeadIdAndStudentId(
    leadId: string,
    studentId: string,
  ): Promise<IWhitelistedStudentDetails> {
    return this.whitelistedStudentDetailsRepository.findOne({
      where: {
        leadId,
        studentId,
        isStudentDeleted: false,
        currentStatus: In(['WHITELISTING', 'ADDED', 'UPDATED']),
      },
    });
  }

  removeStudentDetails(
    whitelistedStudentDetails: IWhitelistedStudentDetails,
  ): Promise<IWhitelistedStudentDetails> {
    whitelistedStudentDetails.currentStatus = WhitelistStatus.DELETED;
    whitelistedStudentDetails.isStudentDeleted = true;
    return this.save(whitelistedStudentDetails);
  }

  findAllStudentsByLeadId(
    leadId: string,
  ): Promise<IWhitelistedStudentDetails[]> {
    return this.whitelistedStudentDetailsRepository.find({
      where: {
        leadId,
        isStudentDeleted: false,
        currentStatus: In(['WHITELISTING', 'ADDED', 'UPDATED']),
      },
      order: { createdAt: 'DESC' },
    });
  }

  save(
    whitelistStudentDetails: IWhitelistedStudentDetails,
  ): Promise<IWhitelistedStudentDetails> {
    return this.whitelistedStudentDetailsRepository.save(
      whitelistStudentDetails,
    );
  }
}
