import {
  LastTransactionSPWhitelist,
  SchoolPayWhitelistResponse,
  StudentPaymentsAggregateSPWhitelist,
  StudentsPaidForSPWhitelist,
} from './schoolpay-whitelisting-response.dto';

const mockLastTransactionSPWhitelist: LastTransactionSPWhitelist = {
  firstName: 'first',
  lastName: 'last',
  amount: '100',
  paymentCode: 'paymentCode',
  registrationNumber: 'regNum',
  middleName: 'middle',
  transactionDate: 'txnDate',
  schoolName: 'schName',
};

const mockStudentPaymentsAggregateSPWhitelist: StudentPaymentsAggregateSPWhitelist =
  {
    firstName: 'first',
    lastName: 'last',
    paymentCode: 'paymentCode',
    countOfPaymentsInLastYear: '10',
    middleName: 'middle',
    sumOfPaymentsInLastYear: '1000',
  };

const mockStudentsPaidForSPWhitelist: StudentsPaidForSPWhitelist = {
  classCode: 'classCode',
  firstName: 'first',
  lastName: 'last',
  minimumAcceptableAmount: '10',
  gender: 'M',
  paymentCode: 'paymentCode',
  registrationNumber: 'regNum',
  middleName: 'middle',
  schoolName: 'schName',
  activeFees: '200',
};
export const mockSchoolPayWhitelistResponse: SchoolPayWhitelistResponse = {
  lastTransaction: mockLastTransactionSPWhitelist,
  studentPaymentsAggregate: [mockStudentPaymentsAggregateSPWhitelist],
  studentsPaidFor: [mockStudentsPaidForSPWhitelist],
  responseStatusCode: '200',
  responseStatusMessage: 'OK',
  whitelisted: 'Y',
};
