import { DeviceDetailsDTO } from './deviceDetails.dto';

export const generateMockDeviceDetailsDTO = () => {
  const dto = new DeviceDetailsDTO();
  dto.deviceId = 'device134';
  dto.deviceOs = 'Android';
  dto.deviceToken = 'Token1234';
  return dto;
};

it('should pass is it has all the property', async () => {
  const dto: DeviceDetailsDTO = generateMockDeviceDetailsDTO();
  expect(dto).toHaveProperty('deviceId');
  expect(dto).toHaveProperty('deviceToken');
  expect(dto).toHaveProperty('deviceOs');
});
