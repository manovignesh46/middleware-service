import { RetryUpload, RetryUploadPresenter } from './retryUpload.presenter';

export const generateMockRetryUploadPresenter = () => {
  const presenter = new RetryUploadPresenter();

  const retryUpload = new RetryUpload();
  retryUpload.imageName = '/selfie.jpg';
  retryUpload.retryCount = 1;
  retryUpload.url = '/url/base/selfie.jpg';

  presenter.selfie = retryUpload;
  return presenter;
};

it('should pass is it has all the property', async () => {
  const presenter: RetryUploadPresenter = generateMockRetryUploadPresenter();
  expect(presenter).toHaveProperty('selfie');
});
