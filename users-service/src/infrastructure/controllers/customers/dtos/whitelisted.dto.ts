export class WhitelistedDTO {
  id: string;
  countrycode: string;
  msisdn: string;
  whitelisted: string;
  last_payment_amount: number;
  last_payment_date: string;
  student_details: WhiteListedStudentDetailsDTO[];
}

export class WhiteListedStudentDetailsDTO {
  studentName: string;
  schoolCode: string;
  schoolName: string;
  studentRegnNumber: string;
  studentGender: string;
  studentClass: string;
  term_year: string;
  term_1_fee: number;
  term_1_paid: number;
  term_2_fee: number;
  term_2_paid: number;
  term_3_fee: number;
  term_3_paid: number;
}
