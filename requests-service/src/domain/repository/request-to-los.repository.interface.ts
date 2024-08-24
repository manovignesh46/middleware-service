import { IRequestToLOS } from '../model/request-to-los.interface';

export abstract class IRequestToLOSRepository {
  abstract create(requestToLOS: IRequestToLOS): Promise<IRequestToLOS>;
}
