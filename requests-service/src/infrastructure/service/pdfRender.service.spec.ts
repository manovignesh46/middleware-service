jest.mock('puppeteer');
// jest.mock('fs');
import * as fs from 'fs';
import { Test } from '@nestjs/testing';
import { LoanDetailsStatementPresenter } from '../controllers/requests/presenters/loanDetailStatement.presenter';
import { generateMockLoanDetailsStatmentPresenter } from '../controllers/requests/presenters/loanDetailStatement.presenter.spec';
import { PDFRender } from './pdfRender.service';
import { IContentService } from '../../domain/content.service.interface';
import { createMock } from '@golevelup/ts-jest';
import { mockFormData } from '../../domain/model/mocks/form-data.mock';

describe('PDFRender', () => {
  let service: PDFRender;

  const mockContentService = createMock<IContentService>();
  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        PDFRender,
        { provide: IContentService, useValue: mockContentService },
      ],
    }).compile();
    service = module.get<PDFRender>(PDFRender);

    // jest
    //   .spyOn(fs, 'readFileSync')
    //   .mockReturnValueOnce('<html>Hello World</html>' as never);

    jest.spyOn(service, 'pdf').mockResolvedValueOnce(Buffer.from('my pdf'));
  });

  it('Is Defined', () => {
    expect(service).toBeDefined();
  });

  it('create loan Statement returns string', async () => {
    const input: LoanDetailsStatementPresenter =
      generateMockLoanDetailsStatmentPresenter();
    const result = await service.createLoanStatement(input);
    const pattern = /^tmpStatemnt\/Statement-\d{8}-200.pdf$/;
    expect(result).toMatch(pattern);
  });
  it('create loan application form returns string', async () => {
    const result = await service.createLoanApplicationForm(mockFormData);
    const pattern = /^\.\/tmpStatemnt\/loan-application-form-\d{8}-555.pdf$/;
    expect(result).toMatch(pattern);
  });
  it('create loan application form returns string', async () => {
    const result = await service.createLoanApplicationForm(mockFormData);
    const pattern = /^\.\/tmpStatemnt\/loan-application-form-\d{8}-555.pdf$/;
    expect(result).toMatch(pattern);
  });
  it('should throw error is formData.jsonData is not valid JSON', async () => {
    const result = service.createLoanApplicationForm({
      ...mockFormData,
      formData: 'this is not JSON',
    });
    await expect(result).rejects.toThrowError();
  });
  it('should throw error is formData.jsonData is not valid JSON', async () => {
    const result = service.createLoanApplicationForm({
      ...mockFormData,
      formData: 'this is not JSON',
    });
    await expect(result).rejects.toThrowError();
  });
  it('should not log anything if all expected keys are present', () => {
    const objectToCheck = { key1: 'value1', key2: 'value2' };
    const expectedKeys = ['key1', 'key2'];
    const loggerErrorSpy = jest.spyOn(service['logger'], 'error');
    service.checkMissingKeys(objectToCheck, expectedKeys);

    expect(loggerErrorSpy).not.toHaveBeenCalled();
  });

  it('should log missing keys if any expected keys are missing', () => {
    const objectToCheck = { key1: 'value1' };
    const expectedKeys = ['key1', 'key2'];
    const loggerErrorSpy = jest.spyOn(service['logger'], 'error');
    service.checkMissingKeys(objectToCheck, expectedKeys);

    expect(loggerErrorSpy).toHaveBeenCalledTimes(2); // Called twice for both error messages
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'There are missing keys in the LOS jsonData',
    );
    expect(loggerErrorSpy).toHaveBeenCalledWith(['key2']);
  });
});
