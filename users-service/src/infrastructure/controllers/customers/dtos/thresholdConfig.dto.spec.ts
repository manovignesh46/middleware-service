import { ThresholdConfigStatus } from '../../../../domain/enum/thresholdConfigStatus.enum';
import { ThresholdConfigs } from './thresholdConfig.dto';

export const generateMockThresholdConfig = () => {
  const dto = new ThresholdConfigs();

  dto.forItem = 'FACE_MATCH';
  dto.minPercentage = 60;
  dto.outputStatus = ThresholdConfigStatus.NO;

  return dto;
};

it('should have property', async () => {
  const dto: ThresholdConfigs = generateMockThresholdConfig();
  expect(dto).toHaveProperty('forItem');
  expect(dto).toHaveProperty('minPercentage');
  expect(dto).toHaveProperty('outputStatus');
});
