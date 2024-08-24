import { IOfferConfig } from '../../../../domain/model/offerConfig.interface';
import { ExperianData } from '../../../../usecases/experianData';
import { ConfirmStudentDetailsPresenter } from './confirmStudentDetails.presenter';
import { OfferDetail, getOfferDetails } from './dashBoard.presenter';

export const generateMockConfirmStudentDetailsPresenter = () => {
  const mockOfferConfig: IOfferConfig = {
    offerId: '1674033014999',
    offerName: 'NewInstallment',
    offerDescription: 'Installment',
    offerImage: '',
    offerProvider: '',
    activeStatus: 'Active',
    tenure: 90,
    roi: '0.005',
    noOfInstallment: '',
    repaymentFrequency: 'monthly',
    offerLimit: 180000,
    applicationFee: '100',
    createdAt: undefined,
    updatedAt: undefined,
  };

  const offersDetail: OfferDetail = {
    offerId: mockOfferConfig.offerId,
    offerName: mockOfferConfig.offerName,
    offerDescription: mockOfferConfig.offerDescription,
    offerImage: '',
    isActive: 'Active' === mockOfferConfig.activeStatus,
    moreDetails: {
      tenure: mockOfferConfig.tenure,
      roi: mockOfferConfig.roi,
      repaymentFrequency: mockOfferConfig.repaymentFrequency,
      noOfInstallment: mockOfferConfig.noOfInstallment,
      limit: mockOfferConfig.offerLimit,
      applicationfee: mockOfferConfig.applicationFee,
    },
  };

  const presenter: ConfirmStudentDetailsPresenter = {
    studentPCOId: '123456789',
    minLoanAmount: 0,
    maxLoanAmount: 100000,
    offersDetail: offersDetail,
  };

  return presenter;
};

it('should pass is it has all the property', async () => {
  const presenter: ConfirmStudentDetailsPresenter =
    generateMockConfirmStudentDetailsPresenter();
  expect(presenter).toHaveProperty('minLoanAmount');
  expect(presenter).toHaveProperty('maxLoanAmount');
  expect(presenter).toHaveProperty('offersDetail');
  expect(presenter).toHaveProperty('studentPCOId');
});
