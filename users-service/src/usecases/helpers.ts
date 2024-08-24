import moment from 'moment';

export function generateOTP(isHardcodedOtp: boolean) {
  if (isHardcodedOtp) {
    return 'ABC-123456';
  }
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase();
  let letters = '';
  for (let i = 0; i < 3; i++) {
    letters += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  const numbers = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');

  const output = `${letters}-${numbers}`;
  return output;
}

export function getTimeToUnlockMinutes(
  otpStatusAt: Date,
  otpLockedCooloffSeconds: number,
) {
  const timeDiff = Date.now() - otpStatusAt.getTime();
  if (timeDiff < 0) {
    return 0;
  } else {
    return Math.ceil((otpLockedCooloffSeconds - timeDiff / 1000) / 60);
  }
}

export function dateParserDashSeparatedPastDate(dateString: string) {
  //overwrite moment method for parsing yy to yyyy for PAST dates
  moment.parseTwoDigitYear = function (yearString) {
    const currentYearTwoDigit = new Date().getFullYear().toString().slice(-2);
    if (yearString >= currentYearTwoDigit) {
      return parseInt(yearString) + 1900;
    }
    return parseInt(yearString) + 2000;
  };
  return dateParserDashSeparated(dateString);
}
export function dateParserDashSeparatedFutureDate(dateString: string) {
  //overwrite moment method for parsing yy to yyyy for FUTURE dates
  moment.parseTwoDigitYear = function (yearString) {
    return parseInt(yearString) + 2000; //Assume no NINs expiring in 1900s
  };
  return dateParserDashSeparated(dateString);
}

//parses a datestring of dd.mm.yyyy to a proper date object
export function dateParserDashSeparated(dateString: string) {
  const response = moment(dateString, 'DD-MM-YY').format('DD.MM.YYYY');
  if (response === 'Invalid date') {
    throw new Error('Date is invalid');
  }
  return response;
}

export function dateStringToDateObject(dateString: string) {
  if (moment(dateString, 'DD.MM.YYYY').isValid()) {
    return moment(dateString, 'DD.MM.YYYY').toDate();
  }
}

export function isValidDate(dateString: string): boolean {
  /* Valid OCR format is dd.mm.yyyy */
  const isDotSeparated = moment(dateString, 'DD.MM.YYYY', true).isValid();

  /* Valid MRZ format is dd-mm-yy */
  const isDashSeparated = moment(dateString, 'DD-MM-YY', true).isValid();

  return isDotSeparated || isDashSeparated;
}

export function isDotSeparatedDate(dateString: string): boolean {
  return moment(dateString, 'DD.MM.YYYY', true).isValid();
}

export function getTimestamp() {
  return moment().utcOffset('+0300').format('YYYYMMDDHHmmss').toString();
}

//generate random number of length x
export function generateNumberStringOfLength(length): string {
  if (length === 0) {
    return '';
  } else {
    return (
      Math.floor(Math.random() * 10).toString() +
      generateNumberStringOfLength(length - 1)
    );
  }
}

//for telco kyc dob comparison in /otp-trigger-general endpoint
export function parseDate(inputDate: string): moment.Moment | null {
  // Try parsing the date in different formats
  const formats = ['DD/MM/YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD'];

  for (const format of formats) {
    const parsedDate = moment(inputDate, format, true);

    if (parsedDate.isValid()) {
      return parsedDate;
    }
  }

  // Return null if the date couldn't be parsed in any format
  return null;
}

//calculate days to id card expiry
export function getDaysToExpiry(idCardExpiryDate: Date): number {
  if (!idCardExpiryDate) return 0;
  const currentDate = new Date();
  const diff = idCardExpiryDate.getTime() - currentDate.getTime();
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  return diffDays;
}
