import { ApiProperty } from '@nestjs/swagger';
import {
  dateParserDashSeparatedFutureDate,
  dateParserDashSeparatedPastDate,
  isValidDate,
} from '../../../../usecases/helpers';
import { BasePresenter } from '../../common/basePresenter';
import { CustIdCardDetailsServiceDto } from '../dtos/cust-id-card-details-service.dto';
import { MRZ, OCR } from '../dtos/idCardScan.dto';

export class IdCardScanPresenter extends BasePresenter {
  backSideImagePresignedUrl: string;

  frontSideImagePresignedUrl: string;

  faceImagePresignedUrl: string;

  scannedDetails: ScannedDetails;

  constructor(custIdCarDetailsServiceDto: CustIdCardDetailsServiceDto) {
    super();
    this.scannedDetails = custIdCarDetailsServiceDto.scannedDetails;
    this.backSideImagePresignedUrl =
      custIdCarDetailsServiceDto.backsideImagePresignedUrl;
    this.frontSideImagePresignedUrl =
      custIdCarDetailsServiceDto.frontsideImagePresignedUrl;
    this.faceImagePresignedUrl =
      custIdCarDetailsServiceDto.faceImagePresignedUrl;
  }
}
export class Matcher {
  @ApiProperty()
  value: string;

  @ApiProperty({ type: Boolean })
  matched = false;
}

export class ScannedDetails {
  @ApiProperty({ type: Matcher })
  givenName: Matcher = new Matcher();

  @ApiProperty({ type: Matcher })
  surname: Matcher = new Matcher();

  @ApiProperty({ type: Matcher })
  dob: Matcher = new Matcher();

  @ApiProperty({ type: Matcher })
  nin: Matcher = new Matcher();

  @ApiProperty({ type: Matcher })
  ninExpiryDate: Matcher = new Matcher();

  constructor(ocr: OCR, mrz: MRZ) {
    this.givenName = new Matcher();
    this.surname = new Matcher();
    this.dob = new Matcher();
    this.nin = new Matcher();
    this.ninExpiryDate = new Matcher();

    this.givenName.value = mrz.givenName;
    this.givenName.matched = ocr.givenName === mrz.givenName;

    this.surname.value = mrz.surname;
    this.surname.matched = ocr.surname === mrz.surname;

    if (isValidDate(mrz.dob)) {
      this.dob.value = dateParserDashSeparatedPastDate(mrz.dob);
    } else {
      this.dob.value = '01.01.2000'; //hardcode a date if MRZ is invalid
    }

    if (isValidDate(ocr.dob) && isValidDate(mrz.dob)) {
      this.dob.matched = ocr.dob === dateParserDashSeparatedPastDate(mrz.dob); // Compare DOBs only if MRZ and OCR DOBs are of the expected format
    } else {
      this.dob.matched = false;
    }

    this.nin.value = mrz.nin;
    this.nin.matched = ocr.nin === mrz.nin;

    if (isValidDate(mrz.ninExpiryDate)) {
      this.ninExpiryDate.value = dateParserDashSeparatedFutureDate(
        mrz.ninExpiryDate,
      );
    } else {
      this.ninExpiryDate.value = '01.01.2000';
    }

    if (isValidDate(ocr.ninExpiryDate) && isValidDate(mrz.ninExpiryDate)) {
      this.ninExpiryDate.matched =
        ocr.ninExpiryDate ===
        dateParserDashSeparatedFutureDate(mrz.ninExpiryDate);
    } else {
      this.ninExpiryDate.matched = false;
    }
  }
}
