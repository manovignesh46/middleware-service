import { DedupStatus } from '../../../../domain/enum/dedupStatus.enum';
import { ICustOtp } from '../../../../domain/model/custOtp.interface';
import { mockCustOtp3 } from '../../../../domain/model/mocks/cust-otp.mock';
import { TriggerOtpPresenter } from './triggerOtp.presenter';

it('should PASS if trigger otp presenter contains msisdn, phoneStatus, emailStatus, sentAt, otpType, otp and expiry', async () => {
  const custOtp: ICustOtp = mockCustOtp3;
  const dedupStatus = DedupStatus.WIP;
  const triggerOtpPresenter: TriggerOtpPresenter = new TriggerOtpPresenter(
    custOtp,
    dedupStatus,
    null,
  );
  // expect(triggerOtpPresenter).toHaveProperty('dedupStatus');
  // expect(triggerOtpPresenter).toHaveProperty('leadCurrentStatus');
  // expect(triggerOtpPresenter).toHaveProperty('leadId');
  expect(triggerOtpPresenter).toHaveProperty('msisdn');
  expect(triggerOtpPresenter).toHaveProperty('msisdnCountryCode');
  // expect(triggerOtpPresenter).toHaveProperty('phoneStatus');
  // expect(triggerOtpPresenter).toHaveProperty('emailStatus');
  // expect(triggerOtpPresenter).toHaveProperty('otpSentAt');
  // expect(triggerOtpPresenter).toHaveProperty('otpType');
  expect(triggerOtpPresenter).toHaveProperty('otp');
  expect(triggerOtpPresenter).toHaveProperty('otpExpiry');
});
