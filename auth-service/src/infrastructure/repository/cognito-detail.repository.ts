import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ICognitoDetail } from '../../domain/models/cognito-detail.interface';
import { ICognitoDetailRepository } from '../../domain/repositories/cognito-detail-repository.interface';
import { CognitoDetail } from '../entities/cognito-detail.entity';

Injectable();
export class CognitoDetailRepository implements ICognitoDetailRepository {
  constructor(
    @InjectRepository(CognitoDetail)
    private cognitoDetailRepository: Repository<ICognitoDetail>,
  ) {}
  async delete(customerId: string): Promise<boolean> {
    const deleteResult: DeleteResult =
      await this.cognitoDetailRepository.delete({
        customerId,
      });
    if (deleteResult?.affected == 1) return true;
    return false;
  }
  create(cognitoDetail: ICognitoDetail): Promise<ICognitoDetail> {
    return this.cognitoDetailRepository.save(cognitoDetail);
  }
  findByCustomerId(customerId: string): Promise<ICognitoDetail> {
    return this.cognitoDetailRepository.findOneByOrFail({ customerId });
  }
  findByMsisdn(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<ICognitoDetail> {
    return this.cognitoDetailRepository.findOneBy({
      msisdnCountryCode,
      msisdn,
    });
  }
  async update(cognitoDetail: ICognitoDetail): Promise<ICognitoDetail> {
    const existingCognitoDetail = await this.findByCustomerId(
      cognitoDetail.customerId,
    );
    return this.cognitoDetailRepository.save({
      ...existingCognitoDetail,
      ...cognitoDetail,
    });
  }
}
