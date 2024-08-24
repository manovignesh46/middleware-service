import { isEmail } from 'class-validator';
import { TriggerOtpDto } from './triggerOtp.dto';

export function validateOtpTrigger(triggerOtpDto: TriggerOtpDto): string {
  let message: string;

  if (!isValidMSISDNCountryCode(triggerOtpDto.msisdnCountryCode))
    message = 'Please enter a Valid countryCode';

  if (message == null)
    message = isValidMSISDN(
      triggerOtpDto.msisdn,
      triggerOtpDto.msisdnCountryCode,
    );
  if (message == null)
    message = isValidPreferredName(triggerOtpDto.preferredName);
  if (message == null) message = isValidEmail(triggerOtpDto.email);

  return message;
}

// export function isValidNIN(nin: string): any {
//   let message = '';
//   if (nin == null) message = 'ID Number is required';
//   else if (nin.length !== 14 && isAlphaNumeric(nin))
//     message = 'Enter valid ID Number';

//   return { message: message, status: message.length !== 0 };
// }

export function isValidMSISDNCountryCode(msisdnCountryCode: string): boolean {
  return ['+256', '+254', '+91', '+971', '+65'].includes(msisdnCountryCode);
}

export function isValidMSISDN(
  msisdn: string,
  msisdnCountryCode: string,
): string {
  if (msisdn == null && isValidMSISDNCountryCode(msisdnCountryCode))
    return 'Please enter Mobile Number';
  else if (msisdn.charAt(0) === '0')
    return 'Enter number without "0" at the beginning in Mobile Number';
  else if (
    ('+256' === msisdnCountryCode &&
      (msisdn.length !== 9 || !['2', '3', '7'].includes(msisdn.charAt(0)))) ||
    ('+254' === msisdnCountryCode &&
      (msisdn.length !== 9 || !['1', '4'].includes(msisdn.charAt(0)))) ||
    ('+91' === msisdnCountryCode &&
      (msisdn.length !== 10 ||
        !['6', '7', '8', '9'].includes(msisdn.charAt(0)))) ||
    ('+65' === msisdnCountryCode &&
      (msisdn.length !== 8 || !['8', '9'].includes(msisdn.charAt(0))))
  )
    return 'Please enter a valid Mobile Number';
}

export function isValidPreferredName(preferredName: string): string {
  if (preferredName == null) return 'Preferred Name is required';
  else if (hasWhiteSpace(preferredName))
    return 'Enter single name with no spaces';
  else if (hasSpecialCharacter(preferredName))
    return 'Special character are not allowed';
  else if (preferredName.length < 2 || preferredName.length > 15)
    return 'Please keep it between 2-15 characters';
  else if (!isAlphaOnly(preferredName) || hasNumber(preferredName))
    return 'Numbers are not allowed in preferredName';
}

export function isValidEmail(email: string): string {
  if (!(email == null) && !(email == '')) {
    if (hasWhiteSpace(email))
      return 'Special Characters and spaces not allowed in email';
    else if (email.length < 2 || email.length > 30)
      return 'Please keep it between 2-30 characters in email';
    else if (
      !hasSpecificCharacter(email, '@') ||
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email,
      )
    )
      return 'Enter a valid email';
  }
}

export function isValidDOB(dob: string): boolean {
  return false;
}

export function hasWhiteSpace(s: string): boolean {
  return /\s/g.test(s);
}

export function isAlphaNumeric(s: string): boolean {
  return /^[a-z0-9]+$/i.test(s);
}

export function isAlphaOnly(s: string): boolean {
  return /^[a-z]+$/i.test(s);
}

export function hasNumber(s: string): boolean {
  return /\d/.test(s);
}

export function hasSpecialCharacter(s: string): boolean {
  return !/^[a-z0-9]+$/i.test(s);
}

export function hasSpecificCharacter(
  s: string,
  requiredCharacter: string,
): boolean {
  return s.includes(requiredCharacter);
}
