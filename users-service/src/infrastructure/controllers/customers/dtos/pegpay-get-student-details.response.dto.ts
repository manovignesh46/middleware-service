import { randomUUID } from 'node:crypto';

export class PegpayGetStudentDetailsResponseDto {
  customerRef: string;
  customerName: string;
  schoolName: string;
  studentLevel: string;
  studentLevelDescription: string;
  outstandingBalance: string;
  minimumPaymentAmount: string;
  allowPartialPayments: string;
  statusCode: string;
  statusDescription: string;
  pegpayTranId: string;
  gender: string;
  studentOva: string;
}

export const mockPegpayResponse: PegpayGetStudentDetailsResponseDto = {
  customerRef: 'studentId123',
  customerName: 'John Jendyose',
  schoolName: 'Gayaza High School',
  studentLevelDescription: 'primary 1',
  outstandingBalance: '1000000',
  minimumPaymentAmount: '1000',
  allowPartialPayments: '1',
  studentLevel: undefined,
  statusCode: '0',
  statusDescription: 'Mock Details Retreived',
  pegpayTranId: randomUUID(),
  gender: 'M',
  studentOva: '1000000101',
};
