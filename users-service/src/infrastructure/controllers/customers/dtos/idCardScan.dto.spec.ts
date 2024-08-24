import { validate } from 'class-validator';
import { AddressType } from '../../../../domain/enum/address-type.enum';
import { CountryCodes } from '../../../../domain/enum/country-code.enum';
import { IdCardScanDTO, MRZ, OCR } from './idCardScan.dto';

export const generateMockIdCardScanDto = () => {
  const ocr = new OCR();
  const mrz = new MRZ();

  ocr.givenName = 'abhi';
  ocr.surname = 'rudra';
  ocr.nin = '12345';
  ocr.dob = '31.12.1990';
  ocr.address = {
    village: 'village',
    parish: 'parish',
    subCountry: 'subCountry',
    county: 'county',
    district: 'district',
    countryOfResidence: CountryCodes.Uganda, // Default: UG,
    addressType: AddressType.RESIDENTIAL,
  };

  mrz.givenName = 'abhishek';
  mrz.surname = 'rudra';
  mrz.nin = '12345';
  mrz.dob = '31.12.1990';

  const dto = new IdCardScanDTO();
  dto.mrz = mrz;
  dto.ocr = ocr;

  return dto;
};

it('should PASS if mrz is null', async () => {
  const dto = generateMockIdCardScanDto();
  dto.mrz = null;
  const errors = await validate(dto);
  expect(errors.length).toBe(0);
});

it('should PASS if ocr is null', async () => {
  const dto = generateMockIdCardScanDto();
  dto.ocr = null;
  const errors = await validate(dto);
  expect(errors.length).toBe(0);
});
