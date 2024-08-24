import { MatchStatus } from '../enum/matchStatus.enum';
import { IBase } from './base.interface';

export interface ICustRefinitiv extends IBase {
  id: string;
  idType: string;
  idValue: string;
  caseId: string;
  caseSystemId: string;
  lastScreenedDatesByProviderType: string;
  resultsCount: number;
  resultIdReferenceId: string;
  recieveedResponse: string;
  sanctionStatus: MatchStatus;
  matchedResultElement: string;
  isDataSentToLOS: boolean;
  isActive: boolean;
  resolutionDone: string;
  resolutionSentDate: Date;
  resolutionStatus: string;
}
