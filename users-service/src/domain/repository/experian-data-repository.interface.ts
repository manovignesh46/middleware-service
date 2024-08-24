import { IdType } from '../enum/id-type.enum';
import { IExperianData } from '../model/experian-data.interface';

export abstract class IExperianDataRepository {
  abstract getById(id: string): Promise<IExperianData>;
  abstract getByIdTypeIdValueAndIsActive(
    idType: IdType,
    idValue: string,
  ): Promise<IExperianData>;
  abstract create(experianRequest: IExperianData): Promise<IExperianData>;
  abstract update(experianRequest: IExperianData): Promise<IExperianData>;
}
