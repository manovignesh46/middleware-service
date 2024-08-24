import { Logger } from '@nestjs/common';
import moment from 'moment';

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
export function dateParserDashSeparated(dateString: string): string {
  const response = moment(dateString, 'DD-MM-YY').format('DD.MM.YYYY');
  if (response === 'Invalid date') {
    throw new Error('Date is invalid');
  }
  return response;
}

export function formatDbDatestringForLOS(dateString: string): string {
  const response = moment(dateString, 'YYYY-MM-DD').format('DD-MM-YYYY');
  if (response === 'Invalid date') {
    Logger.log(`Invalid date: ${dateString}`);
    return null;
  }
  return response;
}

export function isValidDate(dateString: string): boolean {
  /* Valid OCR format is dd.mm.yyyy */
  const isDotSeparated = moment(dateString, 'DD.MM.YYYY', true).isValid();

  /* Valid MRZ format is dd-mm-yy */
  const isDashSeparated = moment(dateString, 'DD-MM-YY', true).isValid();

  return isDotSeparated || isDashSeparated;
}
