import { PushStatusType } from '../../../domain/enum/pushStatus.enum';
import { PushStatusDTO } from './pushStatus.dto';

export const generateMockPushStatusDTO = () => {
  const dto = new PushStatusDTO();
  dto.pushId = '177c4d65-cdd0-44de-893c-4794ace69157';
  dto.pushStatus = PushStatusType.DELIVERED;
  return dto;
};

it('should have property', async () => {
  const dto: PushStatusDTO = generateMockPushStatusDTO();
  expect(dto).toHaveProperty('pushId');
  expect(dto).toHaveProperty('pushStatus');
});
