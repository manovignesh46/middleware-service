import { AddressType } from '../enum/address-type.enum';
import { CountryCodes } from '../enum/country-code.enum';
import { Gender } from '../enum/gender.enum';
import { MatchStatus } from '../enum/matchStatus.enum';
import { ThresholdConfigStatus } from '../enum/thresholdConfigStatus.enum';
import { IBase } from './base.interface';

export interface ICustIdCardDetails extends IBase {
  id: string;
  custId: string;
  ocrGivenName: string;
  ocrSurname: string;
  ocrNIN: string;
  ocrNINExpiryDate: string;
  parsedOcrNINExpiryDate: Date;
  ocrDOB: string;
  parsedOcrDOB: Date;
  ocrGender: Gender;
  ocrNationality: string;
  ocrDateOfExpiry: Date;
  ocrCardNo: string;
  ocrSignature: string;
  ocrFace: string;
  ocrIdFront: string;
  ocrIdBack: string;
  mrzGivenName: string;
  mrzSurname: string;
  mrzNIN: string;
  mrzNINExpiryDate: string;
  parsedMrzNINExpiryDate: Date;
  rawMrzDOB: string; //raw is string value from accurascan
  mrzDOB: Date;
  mrzGender: Gender;
  mrzExpirationDate: Date;
  mrzIssuedDate: Date;
  mrzCountry: string;
  mrzNationality: string;
  mrzString: string;
  requestLoadJSON: string;
  scannedCardImageFront: string;
  scannedCardImageBack: string;
  faceImage: string;
  nonPresignedImageFront: string;
  nonPresignedImageBack: string;
  nonPresignedFaceImage: string;
  editedGivenName: string;
  editedSurname: string;
  editedNIN: string;
  editedDOB: Date;
  editedNINExpiryDate: Date;
  telcoNINMrzStatus: MatchStatus;
  telcoNameMrzStatus: ThresholdConfigStatus;
  telcoNameMrzPercent: number;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  district: string;
  countryOfResidence: CountryCodes;
  addressType: AddressType;
  givenNameMatchStatus: boolean;
  surNameMatchStatus: boolean;
  dobMatchStatus: boolean;
  ninMatchStatus: boolean;
  ninExpiryMatchStatus: boolean;
}
