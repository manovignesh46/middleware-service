import { CustomerIdCardDetailsDTO } from './customerIdCardDetails.dto';

export const generateMockCustomerIdCardDetails = () => {
  const dto = new CustomerIdCardDetailsDTO();
  dto.id = '123456';
  dto.custId = '1234';
  dto.ocrGivenName = 'okello';
  dto.ocrSurname = 'wayamane';
  dto.ocrNIN = '987654321';
  dto.ocrGender = 'MALE';
  dto.ocrNationality = 'UG';
  dto.mrzGivenName = 'OKELLO';
  dto.mrzSurname = 'WAYAMANE';
  dto.mrzNIN = '987654321';
  dto.mrzGender = 'MALE';
  dto.scannedCardImageFront = 'FRONT IMAGE';
  dto.scannedCardImageBack = 'BACK IMAGE';

  return dto;
};

it('should have all the property', async () => {
  const dto: CustomerIdCardDetailsDTO = generateMockCustomerIdCardDetails();
  expect(dto).toHaveProperty('id');
  expect(dto).toHaveProperty('custId');
  expect(dto).toHaveProperty('ocrGivenName');
  expect(dto).toHaveProperty('ocrSurname');
  expect(dto).toHaveProperty('ocrNIN');
  expect(dto).toHaveProperty('ocrGender');
  expect(dto).toHaveProperty('ocrNationality');
  expect(dto).toHaveProperty('mrzGivenName');
  expect(dto).toHaveProperty('mrzSurname');
  expect(dto).toHaveProperty('mrzNIN');
  expect(dto).toHaveProperty('mrzGender');
  expect(dto).toHaveProperty('scannedCardImageFront');
  expect(dto).toHaveProperty('scannedCardImageBack');
});
