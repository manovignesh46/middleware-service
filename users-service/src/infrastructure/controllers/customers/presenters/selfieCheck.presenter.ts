import { SelfieMatchStatus } from '../../../../domain/enum/selfieMatchStatus.enum';
export class SelfieCheckPresenter {
  faceMatchStatus: SelfieMatchStatus;
  livenessMatchStatus: SelfieMatchStatus;
  faceMatchComparisonResult: number;
  livenessComparisonResult: number;
  livenessVideoPreSignedS3URL: string;
  selfieImagePreSignedS3URL: string;
}
