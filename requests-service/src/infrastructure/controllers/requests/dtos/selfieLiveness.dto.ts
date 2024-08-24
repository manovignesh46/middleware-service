export class SelfieLivenessDTO {
  id: string;
  custId: string;
  faceMatchScore: number;
  livenessScore: number;
  faceMatchStatus: string;
  livenessMatchStatus: string;
  faceMatchComparisonResult: number;
  livenessComparisonResult: number;
  selfieImagePreSignedS3URL: string;
  livenessVideoPreSignedS3URL: string;
}
