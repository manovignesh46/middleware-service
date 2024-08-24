import {
  EditIdCardScanDTO,
  MRZ,
  OCR,
} from '../../infrastructure/controllers/customers/dtos/idCardScan.dto';
import { ICustIdCardDetails } from '../model/custIdCardDetails.interface';
import { ICustScanCardSelfieCheckDetails } from '../model/custScanCardSelfieCheckDetails.interface';
import { SelfieCheckDTO } from '../../infrastructure/controllers/customers/dtos/selfieCheck.dto';
import { CustIdCardDetailsServiceDto } from '../../infrastructure/controllers/customers/dtos/cust-id-card-details-service.dto';
import { RetryUploadDTO } from '../../infrastructure/controllers/customers/dtos/retryUpload.dto';
import { RetryUploadPresenter } from '../../infrastructure/controllers/customers/presenters/retryUpload.presenter';
import { GetAddressResponseDto } from '../../infrastructure/controllers/customers/dtos/get-address-response.dto';

export abstract class ICustIdCardDetailsService {
  abstract editIdCardDetails(
    custId: string,
    editIdCardScanDTO: EditIdCardScanDTO,
  ): Promise<ICustIdCardDetails>;
  abstract uploadIdCardDetails(
    custId: string,
    ocr: OCR,
    mrz: MRZ,
    custIdCardFrontImageFileName: string,
    custIdCardBackImageFileName: string,
    custFaceImageFileName: string,
  ): Promise<CustIdCardDetailsServiceDto>;
  abstract selfieMatchDetails(
    custId: string,
    custIdScanCardDetails: SelfieCheckDTO,
  ): Promise<ICustScanCardSelfieCheckDetails>;

  abstract getIdCardDetails(customerId: string): Promise<ICustIdCardDetails>;
  abstract getSelfieLiveness(
    customerId: string,
  ): Promise<ICustScanCardSelfieCheckDetails>;

  abstract retryUpload(
    custId: string,
    retryUploadDTO: RetryUploadDTO[],
  ): Promise<RetryUploadPresenter>;

  abstract getAddress(customerId: string): Promise<GetAddressResponseDto>;
}
