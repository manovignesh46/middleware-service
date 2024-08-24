import { PDFOptions } from 'puppeteer';
import { LoanDetailsStatementPresenter } from '../../infrastructure/controllers/requests/presenters/loanDetailStatement.presenter';
import { IFormData } from '../model/form-data.interface';

export abstract class IPDFRenderService {
  abstract createLoanStatement(
    loanDetailsStatement: LoanDetailsStatementPresenter,
  ): Promise<string>;

  abstract createLoanApplicationForm(formData: IFormData);

  abstract pdf(
    html: string,
    path: string,
    customOptions?: PDFOptions,
  ): Promise<Buffer>;
}
