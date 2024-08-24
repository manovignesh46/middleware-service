import { FAQPresenter } from './faq.presenter';

export const generateMockFAQPresenter = () => {
  const presenter = new FAQPresenter();
  presenter.faqs = {
    general: [
      {
        faq: 'abc1',
        ans: 'abc2',
      },
    ],
    legal: [
      {
        faq: 'abc3',
        ans: 'abc3',
      },
      {
        faq: 'abc',
        ans: 'abc',
      },
    ],
    loan: [
      {
        faq: 'abc4',
        ans: 'abc4',
      },
    ],
  };

  return presenter;
};

it('should have all the property', async () => {
  const dto: FAQPresenter = generateMockFAQPresenter();
  expect(dto).toHaveProperty('faqs');
});
