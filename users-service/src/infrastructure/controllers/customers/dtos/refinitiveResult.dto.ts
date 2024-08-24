export class RefinitiveResultDTO {
  resultId: string;
  referenceId: string;
  matchScore: number;
  matchStrength: string;
  matchedTerm: string;
  matchedTerms: MatchedTerms[];
  submittedTerm: string;
  matchedNameType: string;
  secondaryFieldResults: SecondaryFieldResults[];
  sources: string[];
  categories: string[];
  creationDate: string;
  modificationDate: string;
  lastAlertDate: string;
  primaryName: string;
  events: any;
  identityDocuments: string[];
  category: string;
  providerType: string;
  gender: string;
  entityCreationDate: string;
  entityModificationDate: string;
  countryLinks: CountryLinks[];
  resultReview: ResultReview;
  resolution: Resolution;
}

class Resolution {
  statusId: string;
  riskId: string;
  reasonId: string;
  resolutionRemark: string;
  resolutionDate: string;
}

class MatchedTerms {
  term: string;
  type: string;
}

export class SecondaryFieldResults {
  typeId: string;
  submittedValue: string;
  submittedDateTimeValue: string;
  matchedValue: string;
  matchedDateTimeValue: string;
  fieldResult: string;
  field: any;
}

class CountryLinks {
  countryText: string;
  type: string;
  country: any;
}

class ResultReview {
  reviewRequired: boolean;
  reviewRequiredDate: string;
  reviewRemark: string;
  reviewDate: string;
}

export class ResultIdRefIdPair {
  resultId: string;
  referenceId: string;
}
