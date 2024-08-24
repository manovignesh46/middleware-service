import { ApplyLoansPresenter, OfferDetail } from './apply-loans.presenter';

export const generateMockApplyLoansPresenter = () => {
  const offerDetails = new OfferDetail();
  offerDetails.offerId = '1685361055160';
  offerDetails.offerName = 'SFF 3 month product';
  offerDetails.offerDescription = 'Installment';
  offerDetails.offerImage = '';
  offerDetails.isActive = true;
  offerDetails.moreDetails = {
    tenure: 90,
    roi: '0.04',
    repaymentFrequency: 'monthly',
    noOfInstallment: '3',
    limit: 2000000,
    applicationfee: '5',
  };

  const presenter = new ApplyLoansPresenter();
  presenter.maxLoanAmount = 90000;
  presenter.minLoanAmount = 0;
  presenter.studentPCOId = 'pco1231';
  presenter.offersDetail = offerDetails;

  return presenter;
};

it('should have all the property', async () => {
  const dto: ApplyLoansPresenter = generateMockApplyLoansPresenter();
  expect(dto).toHaveProperty('maxLoanAmount');
  expect(dto).toHaveProperty('minLoanAmount');
  expect(dto).toHaveProperty('studentPCOId');
  expect(dto).toHaveProperty('offersDetail');
});
