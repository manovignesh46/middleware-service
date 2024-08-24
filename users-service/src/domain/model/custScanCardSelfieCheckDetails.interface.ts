import { SelfieMatchStatus } from '../enum/selfieMatchStatus.enum';
import { IBase } from './base.interface';

export interface ICustScanCardSelfieCheckDetails extends IBase {
  id: string;
  custId: string;
  faceMatchScore: number;
  livenessScore: number;
  faceMatchStatus: SelfieMatchStatus;
  livenessMatchStatus: SelfieMatchStatus;
  faceMatchComparisonResult: number;
  livenessComparisonResult: number;
  selfieImagePreSignedS3URL: string;
  livenessVideoPreSignedS3URL: string;
  retryCount: string;
}
