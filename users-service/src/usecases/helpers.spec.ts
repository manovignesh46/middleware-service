import {
  dateParserDashSeparatedPastDate,
  generateOTP,
  getDaysToExpiry,
  getTimeToUnlockMinutes,
} from './helpers';

describe('generateOTP function should randomly generate OTP if isHardcodedOtp is false', () => {
  it('should generate an OTP in the format of "abc-123123"', () => {
    const isHardcodedOtp = false;
    const otp = generateOTP(isHardcodedOtp);
    expect(otp).toMatch(/^[A-Z]{3}-\d{6}$/);
    expect(otp).not.toEqual('ABC-123465');
  });
});
describe('generateOTP function should return ABC-123456 if isHArdcodedOtp is true', () => {
  it('should generate an OTP in the format of "abc-123123"', () => {
    const isHardcodedOtp = true;
    const otp = generateOTP(isHardcodedOtp);
    expect(otp).toEqual('ABC-123456');
  });
});

describe('dateParserDotSeparated', () => {
  test('should return a valid Date object for a valid date string', () => {
    const dateString = '31-05-22';
    const expectedDate = '31.05.2022'; // Month is zero-based (0-11)

    expect(dateParserDashSeparatedPastDate(dateString)).toEqual(expectedDate);
  });

  test('should throw an error for a date string with invalid values', () => {
    const invalidValueDateString = '32-05-22';

    expect(() => {
      dateParserDashSeparatedPastDate(invalidValueDateString);
    }).toThrowError();
  });
});

describe('getTimeToUnlockMinutes', () => {
  test('should return correct time difference 10m', () => {
    const timeToUnlockMinutes = getTimeToUnlockMinutes(new Date(), 600);
    expect(timeToUnlockMinutes).toEqual(10);
  });
  test('should return correct time difference 1m', () => {
    const timeToUnlockMinutes = getTimeToUnlockMinutes(new Date(), 60);
    expect(timeToUnlockMinutes).toEqual(1);
  });
});
describe('getDaysToExpiry', () => {
  test('should return date difference for future date', () => {
    const dateTenDaysInFuture = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
    const daysToExpiry = getDaysToExpiry(dateTenDaysInFuture);
    expect(daysToExpiry).toEqual(10);
  });
  test('should return date difference for past date', () => {
    const dateTenDaysInPast = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    const daysToExpiry = getDaysToExpiry(dateTenDaysInPast);
    expect(daysToExpiry).toEqual(-10);
  });
  test('should return 0 for today', () => {
    const dateToday = new Date();
    const daysToExpiry = getDaysToExpiry(dateToday);
    expect(daysToExpiry).toEqual(0);
  });
  test('should return 0 for undefined date', () => {
    const daysToExpiry = getDaysToExpiry(null);
    expect(daysToExpiry).toEqual(0);
  });
});
