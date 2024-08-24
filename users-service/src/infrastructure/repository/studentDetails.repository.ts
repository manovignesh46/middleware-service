import { Injectable } from '@nestjs/common';
import { IStudentDetailsRepository } from '../../domain/repository/studentDetailsRepository.interface';
import { Repository } from 'typeorm';
import { IStudentDetails } from '../../domain/model/studentDetails.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentDetails } from '../entities/studentDetails.entity';

@Injectable()
export class StudentDetailsRepository implements IStudentDetailsRepository {
  constructor(
    @InjectRepository(StudentDetails)
    private readonly studentDetailsRepository: Repository<IStudentDetails>,
  ) {}

  findByPCOIdAndCustId(
    studentPCOId: string,
    associatedCustomerId: string,
  ): Promise<IStudentDetails> {
    return this.studentDetailsRepository.findOne({
      where: { studentPCOId, isCustomerConfirmed: true, associatedCustomerId },
      order: { createdAt: 'DESC' },
    });
  }
  findByStudentUUID(studentId: any): Promise<IStudentDetails> {
    return this.studentDetailsRepository.findOneBy({ studentId });
  }
  countByAggregatorId(aggregatorId: string): Promise<number> {
    return this.studentDetailsRepository.countBy({ aggregatorId });
  }
  countByCustomerIdAggregatorId(
    custId: string,
    aggregatorId: string,
  ): Promise<number> {
    return this.studentDetailsRepository.countBy({
      associatedCustomerId: custId,
      aggregatorId,
    });
  }

  findBySchoolCodeCustIdRegId(
    studentSchoolCode: string,
    associatedCustomerId: string,
    studentSchoolRegnNumber: string,
  ): Promise<IStudentDetails> {
    if (studentSchoolCode == null) {
      return this.studentDetailsRepository.findOne({
        where: {
          associatedCustomerId,
          studentSchoolRegnNumber,
        },
      });
    }

    return this.studentDetailsRepository.findOne({
      where: {
        studentSchoolCode,
        associatedCustomerId,
        studentSchoolRegnNumber,
      },
    });
  }

  findByStudentIdCustIdRegID(
    studentId: string,
    associatedCustomerId: string,
    studentSchoolRegnNumber: string,
  ): Promise<IStudentDetails> {
    return this.studentDetailsRepository.findOne({
      where: {
        studentId,
        associatedCustomerId,
        studentSchoolRegnNumber,
        isStudentDeleted: false,
      },
    });
  }

  findStudentByCustId(
    associatedCustomerId: string,
  ): Promise<IStudentDetails[]> {
    return this.studentDetailsRepository.find({
      where: {
        associatedCustomerId,
        isStudentDeleted: false,
        isCustomerConfirmed: true,
      },
    });
  }

  save(studentDetails: IStudentDetails): Promise<IStudentDetails> {
    return this.studentDetailsRepository.save(studentDetails);
  }

  findByStudentIdCustId(
    studentId: string,
    associatedCustomerId: string,
  ): Promise<IStudentDetails> {
    return this.studentDetailsRepository.findOne({
      where: {
        studentId,
        associatedCustomerId,
        isStudentDeleted: false,
      },
    });
  }
}
