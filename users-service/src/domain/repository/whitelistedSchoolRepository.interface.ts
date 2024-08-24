import { IWhitelistedSchool } from '../model/whitelistedSchool.interface';

export abstract class IWhitelistedSchoolRepository {
  abstract findAll(): Promise<IWhitelistedSchool[]>;
  abstract findByName(schoolName: string): Promise<IWhitelistedSchool>;
}
