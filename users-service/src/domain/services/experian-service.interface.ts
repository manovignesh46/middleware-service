import { IdType } from '../enum/id-type.enum';

export class KycEnquiryDto {
  idType: IdType;
  idValue: string;
  nationalIdNumber: string;
  isConsent?: boolean;
}

export abstract class IExperianService {
  abstract kycEnquiry(kycEnquiryDto: KycEnquiryDto): Promise<void>;
}
