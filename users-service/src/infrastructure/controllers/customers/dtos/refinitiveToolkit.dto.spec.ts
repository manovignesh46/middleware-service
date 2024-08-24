import { RefinitiveToolkitDTO } from './refinitiveToolkit.dto';

export const generateMockRefinitiveToolKitDTO = () => {
  const dto: RefinitiveToolkitDTO = new RefinitiveToolkitDTO();
  dto.id = '1';
  dto.type = '2';
  return dto;
};
it('should have property', async () => {
  const dto: RefinitiveToolkitDTO = generateMockRefinitiveToolKitDTO();
  expect(dto).toHaveProperty('id');
  expect(dto).toHaveProperty('type');
});
