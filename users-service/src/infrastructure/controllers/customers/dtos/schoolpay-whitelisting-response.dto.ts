export class SchoolPayWhitelistResponse {
  lastTransaction: LastTransactionSPWhitelist;
  studentPaymentsAggregate: StudentPaymentsAggregateSPWhitelist[];
  studentsPaidFor: StudentsPaidForSPWhitelist[];
  responseStatusCode: string;
  responseStatusMessage: string;
  whitelisted: 'Y' | 'N';
}

export class LastTransactionSPWhitelist {
  firstName: string;
  lastName: string;
  amount: string;
  paymentCode: string;
  registrationNumber: string;
  middleName: string;
  transactionDate: string;
  schoolName: string;
}

export class StudentPaymentsAggregateSPWhitelist {
  firstName: string;
  lastName: string;
  paymentCode: string;
  countOfPaymentsInLastYear: string;
  middleName: string;
  sumOfPaymentsInLastYear: string;
}

export class StudentsPaidForSPWhitelist {
  classCode: string;
  firstName: string;
  lastName: string;
  minimumAcceptableAmount: string;
  gender: string;
  paymentCode: string;
  registrationNumber: string;
  middleName: string;
  schoolName: string;
  activeFees: string;
}
