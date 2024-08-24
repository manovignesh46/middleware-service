import { ICustRefinitiv } from '../model/custRefinitiv.interface';

export abstract class ICustRefinitivService {
  abstract findAndSaveRefinitiveData(
    isLead: boolean,
    idValue: string,
    name: string,
    gender: string,
    dob: string,
    countryName: string,
  );
  abstract findCustRefinitiv(leadId: string): Promise<ICustRefinitiv>;
  abstract save(custRefinitiv: ICustRefinitiv): Promise<ICustRefinitiv>;
}
