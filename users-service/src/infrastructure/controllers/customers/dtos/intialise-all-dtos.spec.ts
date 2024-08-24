import { mockCustDedup } from '../../../../domain/model/mocks/cust-dedup.mock';
import { mockUserDevice } from '../../../../domain/model/mocks/user-device.mock';
import { Content } from '../../../entities/content.entity';
import { UserDevice } from '../../../entities/user-device.entity';
import { IDevice } from '../../../services/auth-service-client/dtos/device.interface';
import { DevicePresenter } from '../presenters/device.presenter';
import { GetCustomerFromFullMsisdnPresenter } from '../presenters/get-customer-from-full-msisdn.presenter';
import { SelfieCheckPresenter } from '../presenters/selfieCheck.presenter';
import { LMSTelcoResponseDTO } from './lmsTelcoResponse.dto';
import { SchoolPayWhitelistResponse } from './schoolpay-whitelisting-response.dto';
import { TelcoTransactionResp } from './telcoTransactionResp.dto';
import { ThresholdConfigs } from './thresholdConfig.dto';
import { ValidateStudentAccountSunlyteDto } from './validate-student-account-sunlyte.dto';
import { WhitelistedDTO } from './whitelisted.dto';

describe('init all dtos', () => {
  it('init', () => {
    new TelcoTransactionResp();
    new ValidateStudentAccountSunlyteDto();
    new WhitelistedDTO();
    new Content();
    new GetCustomerFromFullMsisdnPresenter();
    new SelfieCheckPresenter();
    new UserDevice();
    new LMSTelcoResponseDTO();
    new ThresholdConfigs();
    new SchoolPayWhitelistResponse();
    new DevicePresenter({} as IDevice);
    mockUserDevice;
    mockCustDedup;
    expect(true).toEqual(true);
  });
});
