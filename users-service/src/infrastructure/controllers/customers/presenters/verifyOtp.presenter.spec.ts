import { randomUUID } from 'crypto';
import { LeadStatus } from '../../../../domain/enum/leadStatus.enum';
import { VerifyOtpPresenter } from './verifyOtp.presenter';

it('should PASS if verify otp presenter contains verified, phoneNumber, countCheck', async () => {
  const leadId = randomUUID();
  const preferredName = 'John';
  const verified = true;
  const msisdnCountryCode = '+65';
  const msisdn = '91700158';
  const countCheck = 5;
  const createdAt = new Date(Date.now());
  const updatedAt = new Date(Date.now());
  const leadStatus = LeadStatus.OTP_VERIFIED;
  const presenter: VerifyOtpPresenter = new VerifyOtpPresenter(
    leadId,
    leadStatus,
    preferredName,
    msisdnCountryCode,
    msisdn,
    countCheck,
    createdAt,
    updatedAt,
  );
  expect(presenter).toHaveProperty('msisdnCountryCode');
  expect(presenter).toHaveProperty('msisdn');
  expect(presenter).toHaveProperty('countCheck');
  expect(presenter).toHaveProperty('createdAt');
  expect(presenter).toHaveProperty('updatedAt');
  expect(presenter).toHaveProperty('leadStatus');
  expect(presenter.msisdnCountryCode).toEqual(msisdnCountryCode);
  expect(presenter.msisdn).toEqual(msisdn);
  expect(presenter.countCheck).toEqual(countCheck);
  expect(presenter.createdAt).toEqual(createdAt);
  expect(presenter.updatedAt).toEqual(updatedAt);
  expect(presenter.leadStatus).toEqual(leadStatus);
});
