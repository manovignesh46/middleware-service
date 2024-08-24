import { validate } from 'class-validator';
import { SelfieCheckDTO } from './selfieCheck.dto';

export const generateselfieCheckDTO = () => {
  const dto = new SelfieCheckDTO();
  dto.livenessScore = 80.12;
  dto.faceMatchScore = 80.12;

  return dto;
};

it('should FAIL when dto.livenessScore is null ', async () => {
  const dto = generateselfieCheckDTO();
  dto.livenessScore = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});

it('should FAIL when dto.faceMatchScore is null ', async () => {
  const dto = generateselfieCheckDTO();
  dto.faceMatchScore = null;
  const errors = await validate(dto);
  expect(errors.length).not.toBe(0);
});
