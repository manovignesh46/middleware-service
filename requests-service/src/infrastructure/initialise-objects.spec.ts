import { LMSFormData } from './controllers/requests/dtos/lmsFormData.dto';
import { LoanDetailsStatementPresenter } from './controllers/requests/presenters/loanDetailStatement.presenter';
import { FAQ } from './entities/faq.entity';
import { FormData } from './entities/form-data.entity';
import { RequestToLOS } from './entities/request-to-los.entity';
import {
  GetLoanApplicationContentInputDto,
  GetLoanApplicationContentOutputDto,
} from './service/service-dtos/get-loan-application-content.dto';

describe('Instantiate all objects', () => {
  it('as Above', () => {
    new FAQ();
    new FormData();
    new RequestToLOS();
    new LMSFormData();
    new LoanDetailsStatementPresenter();
    new GetLoanApplicationContentInputDto();
    new GetLoanApplicationContentOutputDto();
  });
});
