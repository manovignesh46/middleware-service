import { FSResponsePresenter } from './fsResponse.presenter';

export const generateMockFSResponsePresenter = () => {
  const presenter = new FSResponsePresenter();

  presenter.id = '122';
  presenter.status = 'Open';
  presenter.subject = 'Attachment Test 2';
  presenter.description = 'This is another test for attachment';
  presenter.submittedAt = new Date(Date.parse('2023-04-08T20:29:40.521Z'));
  presenter.lastUpdatedAt = new Date(Date.parse('2023-04-08T20:29:40.521Z'));
  presenter.category = 'Inquiry';
  presenter.subCategory = 'Loan Application';

  return [presenter];
};
it('should pass is it has all the property', async () => {
  const presenter: FSResponsePresenter[] = generateMockFSResponsePresenter();
  expect(presenter[0]).toHaveProperty('id');
  expect(presenter[0]).toHaveProperty('status');
  expect(presenter[0]).toHaveProperty('subject');
  expect(presenter[0]).toHaveProperty('description');
  expect(presenter[0]).toHaveProperty('submittedAt');
  expect(presenter[0]).toHaveProperty('lastUpdatedAt');
});
