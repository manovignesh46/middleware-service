import { TelcoKYCResp } from './telcoKycResp.dto';

export const generateMockTelcoKycRespDTO = () => {
  const dto = new TelcoKYCResp();
  dto.id = 1;
  dto.countrycode = 256;
  dto.msisdn = 1234567890;
  dto.firstname = 'Darshan';
  dto.givenname = 'Vadyar';
  dto.nin = 'AB1234567890XY';
  dto.dob = '01/08/1997';
  dto.gender = 'M';
  dto.registration = '01/12/2022';
  dto.nationality = 'UG';

  return dto;
};

it('should have property', async () => {
  const dto: TelcoKYCResp = generateMockTelcoKycRespDTO();
  expect(dto).toHaveProperty('id');
  expect(dto).toHaveProperty('countrycode');
  expect(dto).toHaveProperty('msisdn');
  expect(dto).toHaveProperty('firstname');
  expect(dto).toHaveProperty('givenname');
  expect(dto).toHaveProperty('nin');
  expect(dto).toHaveProperty('dob');
  expect(dto).toHaveProperty('gender');
  expect(dto).toHaveProperty('registration');
  expect(dto).toHaveProperty('nationality');
});
