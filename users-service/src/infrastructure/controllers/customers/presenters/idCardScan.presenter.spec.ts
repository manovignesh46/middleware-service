import { AddressType } from '../../../../domain/enum/address-type.enum';
import { CountryCodes } from '../../../../domain/enum/country-code.enum';
import {
  dateParserDashSeparatedFutureDate,
  dateParserDashSeparatedPastDate,
} from '../../../../usecases/helpers';
import { CustIdCardDetailsServiceDto } from '../dtos/cust-id-card-details-service.dto';
import { generateMockIdCardScanDto } from '../dtos/idCardScan.dto.spec';
import {
  IdCardScanPresenter,
  Matcher,
  ScannedDetails,
} from './idCardScan.presenter';

describe('IdCardScanPresenter', () => {
  let presenter: IdCardScanPresenter;
  const mockedCustIdCardDetailsServiceDto: CustIdCardDetailsServiceDto = {
    scannedDetails: new ScannedDetails(
      generateMockIdCardScanDto().ocr,
      generateMockIdCardScanDto().mrz,
    ),
    backsideImagePresignedUrl: 'backside-url',
    frontsideImagePresignedUrl: 'frontside-url',
    faceImagePresignedUrl: 'face-url',
    isNINMatched: false,
  };
  beforeEach(() => {
    presenter = new IdCardScanPresenter(mockedCustIdCardDetailsServiceDto);
  });

  test('should initialize the presenter with the provided details', () => {
    expect(presenter.scannedDetails).toBeInstanceOf(ScannedDetails);
    expect(presenter.backSideImagePresignedUrl).toBe(
      mockedCustIdCardDetailsServiceDto.backsideImagePresignedUrl,
    );
    expect(presenter.frontSideImagePresignedUrl).toBe(
      mockedCustIdCardDetailsServiceDto.frontsideImagePresignedUrl,
    );
    expect(presenter.faceImagePresignedUrl).toBe(
      mockedCustIdCardDetailsServiceDto.faceImagePresignedUrl,
    );
  });
});

describe('ScannedDetails', () => {
  const mockedOCR = {
    givenName: 'John',
    surname: 'Doe',
    dob: '01.01.1990',
    nin: '1234567890',
    ninExpiryDate: '01.01.2030',
    address: {
      village: 'NANSANA WEST',
      parish: 'NANSANA',
      subCountry: 'NANSANA DIVISION',
      county: 'KYADONDO',
      district: 'WAKISO',
      countryOfResidence: CountryCodes.Uganda,
      addressType: AddressType.RESIDENTIAL,
    },
  };

  const mockedMRZ = {
    givenName: 'John',
    surname: 'Doe',
    dob: '01-01-90',
    nin: '1234567890',
    ninExpiryDate: '01-01-30',
  };
  const mockedMRZAllMismatch = {
    givenName: 'Jan',
    surname: 'Dace',
    dob: '01-01-05',
    nin: '0000000000',
    ninExpiryDate: '01-01-50',
  };

  let scannedDetails: ScannedDetails;
  let scannedDetailsMismatch: ScannedDetails;

  beforeEach(() => {
    scannedDetails = new ScannedDetails(mockedOCR, mockedMRZ);
    scannedDetailsMismatch = new ScannedDetails(
      mockedOCR,
      mockedMRZAllMismatch,
    );
  });

  test('should initialize the givenName Matcher correctly', () => {
    expect(scannedDetails.givenName).toBeInstanceOf(Matcher);
    expect(scannedDetails.givenName.value).toBe(mockedMRZ.givenName);
    expect(scannedDetails.givenName.matched).toBe(true);
    expect(scannedDetailsMismatch.givenName).toBeInstanceOf(Matcher);
    expect(scannedDetailsMismatch.givenName.value).toBe(
      mockedMRZAllMismatch.givenName,
    );
    expect(scannedDetailsMismatch.givenName.matched).toBe(false);
  });

  test('should initialize the surname Matcher correctly', () => {
    expect(scannedDetails.surname).toBeInstanceOf(Matcher);
    expect(scannedDetails.surname.value).toBe(mockedMRZ.surname);
    expect(scannedDetails.surname.matched).toBe(true);
    expect(scannedDetailsMismatch.surname).toBeInstanceOf(Matcher);
    expect(scannedDetailsMismatch.surname.value).toBe(
      mockedMRZAllMismatch.surname,
    );
    expect(scannedDetailsMismatch.surname.matched).toBe(false);
  });

  test('should initialize the dob Matcher correctly', () => {
    expect(scannedDetails.dob).toBeInstanceOf(Matcher);
    expect(scannedDetails.dob.value).toBe(
      dateParserDashSeparatedPastDate(mockedMRZ.dob),
    );
    expect(scannedDetails.dob.matched).toBe(true);
    expect(scannedDetailsMismatch.dob).toBeInstanceOf(Matcher);
    expect(scannedDetailsMismatch.dob.value).toBe(
      dateParserDashSeparatedPastDate(mockedMRZAllMismatch.dob),
    );
    expect(scannedDetailsMismatch.dob.matched).toBe(false);
  });

  test('should initialize the nin Matcher correctly', () => {
    expect(scannedDetails.nin).toBeInstanceOf(Matcher);
    expect(scannedDetails.nin.value).toBe(mockedMRZ.nin);
    expect(scannedDetails.nin.matched).toBe(true);
    expect(scannedDetailsMismatch.nin).toBeInstanceOf(Matcher);
    expect(scannedDetailsMismatch.nin.value).toBe(mockedMRZAllMismatch.nin);
    expect(scannedDetailsMismatch.nin.matched).toBe(false);
  });
  test('should initialize the ninExpiryDate Matcher correctly', () => {
    expect(scannedDetails.ninExpiryDate).toBeInstanceOf(Matcher);
    expect(scannedDetails.ninExpiryDate.value).toBe(
      dateParserDashSeparatedFutureDate(mockedMRZ.ninExpiryDate),
    );
    expect(scannedDetails.ninExpiryDate.matched).toBe(true);
    expect(scannedDetailsMismatch.ninExpiryDate).toBeInstanceOf(Matcher);
    expect(scannedDetailsMismatch.ninExpiryDate.value).toBe(
      dateParserDashSeparatedFutureDate(mockedMRZAllMismatch.ninExpiryDate),
    );
    expect(scannedDetailsMismatch.ninExpiryDate.matched).toBe(false);
  });
});
