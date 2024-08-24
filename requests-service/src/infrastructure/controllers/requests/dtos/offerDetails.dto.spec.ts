import { OfferDetailsDTO } from './offerDetails.dto';

export const generateMockOfferDetailsDTO = () => {
  const dto = new OfferDetailsDTO();
  dto.offerId = '1685361055160';
  dto.offerName = 'SFF 3 month product';
  dto.offerDescription = 'Installment';
  dto.offerImage = null;
  dto.offerProvider = null;
  dto.activeStatus = 'Active';
  dto.tenure = 90;
  dto.roi = '0.04';
  dto.noOfInstallment = '3';
  dto.repaymentFrequency = 'monthly';
  dto.offerLimit = 2000000;
  dto.applicationFee = '5';

  return dto;
};

it('should have all the property', async () => {
  const dto: OfferDetailsDTO = generateMockOfferDetailsDTO();
  expect(dto).toHaveProperty('offerId');
  expect(dto).toHaveProperty('offerName');
  expect(dto).toHaveProperty('offerDescription');
  expect(dto).toHaveProperty('offerImage');
  expect(dto).toHaveProperty('offerProvider');
  expect(dto).toHaveProperty('activeStatus');
  expect(dto).toHaveProperty('tenure');
  expect(dto).toHaveProperty('roi');
  expect(dto).toHaveProperty('noOfInstallment');
  expect(dto).toHaveProperty('repaymentFrequency');
  expect(dto).toHaveProperty('offerLimit');
  expect(dto).toHaveProperty('applicationFee');
});
