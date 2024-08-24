import { Injectable } from '@nestjs/common';
import { IWhitelistedSchoolRepository } from '../../domain/repository/whitelistedSchoolRepository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { WhitelistedSchool } from '../entities/whitelistedSchool.entity';
import { IWhitelistedSchool } from '../../domain/model/whitelistedSchool.interface';
import { Repository } from 'typeorm';

@Injectable()
export class WhitelistedSchoolRepository
  implements IWhitelistedSchoolRepository
{
  constructor(
    @InjectRepository(WhitelistedSchool)
    private readonly whitelistedSchoolRepository: Repository<IWhitelistedSchool>,
  ) {}
  findByName(schoolName: string): Promise<IWhitelistedSchool> {
    return this.whitelistedSchoolRepository.findOne({ where: { schoolName } });
  }
  findAll(): Promise<IWhitelistedSchool[]> {
    return this.whitelistedSchoolRepository.find();
  }
}
