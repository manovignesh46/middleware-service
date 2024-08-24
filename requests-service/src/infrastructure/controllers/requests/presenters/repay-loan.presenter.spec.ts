import { RepayLoanPresenter } from './repay-loan.presenter';

export const generateMockReoayLoanPresenter = () => {
  const presenter: RepayLoanPresenter = new RepayLoanPresenter(
    '+256779999707_external_receipt_id_1710939123758',
    'YABX2796L4872R1710939123950',
    'YABX2796L4872R1710939123950',
    'YABX2796L4872R1710939125042',
    '1685014421007',
    2000,
  );
  return presenter;
};

describe('RepayLoanPresenter', () => {
  let presenter: RepayLoanPresenter;
  const outstandingBalance = 1000;
  const outstandingPrincipal = 800;
  const outstandingInterest = 200;
  const outstandingFee = 50;
  const loanDueDate = '31.05.2023';

  beforeEach(() => {
    presenter = new RepayLoanPresenter(
      '+256779999707_external_receipt_id_1710939123758',
      'YABX2796L4872R1710939123950',
      'YABX2796L4872R1710939123950',
      'YABX2796L4872R1710939125042',
      '1685014421007',
      2000,
    );
  });

  test('should have correct properties', () => {
    expect(presenter.requestId).toBe(
      '+256779999707_external_receipt_id_1710939123758',
    );
    expect(presenter.transactionId).toBe('YABX2796L4872R1710939123950');
    expect(presenter.externalTransactionId).toBe('YABX2796L4872R1710939123950');
    expect(presenter.referenceId).toBe('YABX2796L4872R1710939125042');
    expect(presenter.offerId).toBe('1685014421007');
  });
});
