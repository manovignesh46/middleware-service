import { ExperianData } from '../../../../usecases/experianData';
import {
  DashBoardPresenter,
  OfferDetail,
  getOfferDetails,
} from './dashBoard.presenter';

export const generateMockDashBoardDetailsPresenter = async () => {
  const res = new DashBoardPresenter();

  res.approvedAmount = 180000;
  res.activeLoansAmount = 0;
  res.activeLoansDetails = [
    // {
    //   loanProduct: 'Test',
    //   loanId: '122',
    //   loanAmount: 423123,
    //   loanDueAmount: 4332423,
    //   loanDueDate: new Date(Date.parse('2023-04-08T20:29:40.521Z')),
    //   studentId: '1234567890',
    //   studentName: 'Hawk',
    //   type: 'School Loan',
    //   studentRegnNumber: '1243223',
    //   schoolCode: 'XY-132323',
    // },
  ];

  const offersDetails: OfferDetail[] = await getOfferDetails(
    ExperianData.mockLOSResponse['actions'][0]['payload']['eligible_variants'],
  );

  res.offersDetails = offersDetails;

  // res.studentsDetails = [genertaeMockRetrieveStudentDetailsPresenter()];

  return res;
};

it('should be defined', () => {
  expect(generateMockDashBoardDetailsPresenter()).toBeDefined();
});

it('should it has all the property', async () => {
  const presenter: DashBoardPresenter =
    await generateMockDashBoardDetailsPresenter();
  expect(presenter).toHaveProperty('approvedAmount');
  expect(presenter).toHaveProperty('activeLoansAmount');
  expect(presenter).toHaveProperty('activeLoansDetails');
  expect(presenter).toHaveProperty('offersDetails');
  // expect(presenter).toHaveProperty('studentsDetails');
});
