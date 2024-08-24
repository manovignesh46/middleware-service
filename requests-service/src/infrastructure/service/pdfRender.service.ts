import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import moment from 'moment';
import puppeteer, { PDFOptions } from 'puppeteer';
import { IContentService } from '../../domain/content.service.interface';
import { IFormData } from '../../domain/model/form-data.interface';
import { IPDFRenderService } from '../../domain/service/IPDFRender.service';
import { EMI, LMSFormData } from '../controllers/requests/dtos/lmsFormData.dto';
import { LoanDetailsStatementPresenter } from '../controllers/requests/presenters/loanDetailStatement.presenter';
import { loanApplicationFormExpectedKeys } from './helpers/pdf-render-expected-keys';

@Injectable()
export class PDFRender implements IPDFRenderService {
  constructor(private contentService: IContentService) {}
  private readonly logger = new Logger(PDFRender.name);
  private twoDecimals = { minimumFractionDigits: 2 }; //config for .toLocalString()

  async createLoanStatement(
    loanDetailsStatement: LoanDetailsStatementPresenter,
  ): Promise<string> {
    // Data to be populated
    const loanDetails = {
      customerName: loanDetailsStatement.loanApplicationDetails.customerName,
      msisdn: loanDetailsStatement.loanApplicationDetails.msisdn,
      studentName:
        loanDetailsStatement.loanApplicationDetails.studentInfo.studentName,
      schoolName:
        loanDetailsStatement.loanApplicationDetails.studentInfo.schoolName,
      loanId: loanDetailsStatement.loanApplicationDetails.loanId,
      todayDate: moment(new Date()).format('DD.MM.YYYY'),
      statementFromDate: moment(
        loanDetailsStatement.loanApplicationDetails.statementStartDate,
      ).format('DD.MM.YYYY'),
      statementToDate: moment(
        loanDetailsStatement.loanApplicationDetails.statementEndDate,
      ).format('DD.MM.YYYY'),
    };

    const loanSummary = {
      loanDisburementDate: moment(
        loanDetailsStatement.loanSummary.disbursementDate,
      ).format('DD.MM.YYYY'),
      amountDisbursed:
        loanDetailsStatement.loanSummary.requestedLoanAmount?.toLocaleString(
          undefined,
          this.twoDecimals,
        ),
      loanAmount: loanDetailsStatement.loanSummary.loanAmount?.toLocaleString(
        undefined,
        this.twoDecimals,
      ),
      OutstandingLoanBalance:
        loanDetailsStatement.loanSummary.outstandingBalance?.toLocaleString(
          undefined,
          this.twoDecimals,
        ),
    };

    loanDetailsStatement.loanTransactionsDetails.sort(function (a, b) {
      const textA = a.transactionDateTime;
      const textB = b.transactionDateTime;
      return a.transactionDateTime < a.transactionDateTime
        ? -1
        : textA > textB
        ? 1
        : 0;
    });

    const transactionData = [];
    for await (const loanTrans of loanDetailsStatement.loanTransactionsDetails) {
      const amount = loanTrans.amount?.toLocaleString(
        undefined,
        this.twoDecimals,
      );
      const transaction = [
        moment(loanTrans.transactionDateTime).format('DD.MM.YYYY'),
        loanTrans.transactionNumber,
        await this.convertToTitleCase(loanTrans.description),
        loanTrans.transactionType?.toLowerCase() === 'debit' ? amount : '',
        loanTrans.transactionType?.toLowerCase() === 'credit' ? amount : '',
        loanTrans.balance?.toLocaleString(undefined, this.twoDecimals),
      ];
      transactionData.push(transaction);
    }

    const contentData = await this.contentService.getLoanApplicationFormData();

    const columnheadings = [
      'Date',
      'Transaction No.',
      'Description',
      'Disbursements',
      'Repayments',
      'Balance',
    ];

    const data = {
      loanDetails: loanDetails,
      loanSummary: loanSummary,
      columnheadings: columnheadings,
      transactionData: transactionData,
      bankLogo: `data:image/jpeg;base64,${fs
        .readFileSync('src/resources/opportunity-bank-logo.png')
        .toString('base64')}`,
      furahaIcon: `data:image/jpeg;base64,${fs
        .readFileSync('src/resources/icon-orangeBG.png')
        .toString('base64')}`,
      currentTimestamp: `${moment(moment.now())
        .utcOffset('+0300')
        .format('DD.MM.YYYY')}`,
      content: contentData,
    };

    // HTML page
    const content = await fs.readFileSync(
      './src/infrastructure/service/loanStatement.html',
      'utf8',
    );

    const template: HandlebarsTemplateDelegate = Handlebars.compile(content);
    const renderedHTML = template(data);

    const path = `tmpStatemnt/Statement-${moment().utc().format('DDMMYYYY')}-${
      loanDetailsStatement.loanApplicationDetails.loanId
    }.pdf`;

    const customOptions: PDFOptions = {
      format: 'A4',
      path: path,
      printBackground: true,
    };

    return (await this.pdf(renderedHTML, path, customOptions)) ? path : null;
  }

  async createLoanApplicationForm(formData: IFormData) {
    const content = await this.contentService.getLoanApplicationFormData();

    let parsedFormDataJson: LMSFormData;
    try {
      parsedFormDataJson = JSON.parse(formData.formData);
    } catch (e) {
      this.logger.error('Invalid JSON in LOS Form Data JSON');
      throw e;
    }
    this.checkMissingKeys(parsedFormDataJson, loanApplicationFormExpectedKeys);

    const htmlTemplate = fs.readFileSync(
      './src/resources/loan-application-template.html',
      'utf8',
    );

    if (
      parsedFormDataJson?.installmentFrequency?.toLowerCase() == 'weekly' &&
      parsedFormDataJson?.loanPeriod
    ) {
      //loanPeriod is always in months. For weekly repayments this value is multiplied by 4 (FUR-9256)
      parsedFormDataJson.loanPeriod = parsedFormDataJson.loanPeriod * 4;
    }

    const formatedEmis: EMI[] = [];
    for await (const emi of parsedFormDataJson.emis) {
      const newEmiFormat = new EMI();
      newEmiFormat.emi_due_date = moment(emi.emi_due_date).format('DD.MM.YYYY');
      newEmiFormat.emi_amount = emi.emi_amount;
      formatedEmis.push(newEmiFormat);
    }
    const columnheadings = ['Date', 'Payable Amount '];

    const data = {
      bankLogo: `data:image/jpeg;base64,${fs
        .readFileSync('src/resources/opportunity-bank-logo.png')
        .toString('base64')}`,
      furahaIcon: `data:image/jpeg;base64,${fs
        .readFileSync('src/resources/icon-orangeBG.png')
        .toString('base64')}`,
      formData: {
        ...parsedFormDataJson,

        firstInstallmentDate: moment(
          parsedFormDataJson.firstInstallmentDate,
        ).format('DD.MM.YYYY'),
        lastInstallmentDate: moment(
          parsedFormDataJson.lastInstallmentDate,
        ).format('DD.MM.YYYY'),
        //Ensure all numbers are formatted with commas e.g. 10,000,000
        schoolFeesAmount: parsedFormDataJson?.schoolFeesAmount?.toLocaleString(
          undefined,
          this.twoDecimals,
        ),
        variantMinLoanAmount:
          parsedFormDataJson?.variantMinLoanAmount?.toLocaleString(
            undefined,
            this.twoDecimals,
          ),
        variantMaxLoanAmount:
          parsedFormDataJson?.variantMaxLoanAmount?.toLocaleString(
            undefined,
            this.twoDecimals,
          ),
        arrangementFeesAmount:
          parsedFormDataJson?.arrangementFeesAmount?.toLocaleString(
            undefined,
            this.twoDecimals,
          ),
        loanInterestAmount:
          parsedFormDataJson?.loanInterestAmount?.toLocaleString(
            undefined,
            this.twoDecimals,
          ),
        totalAmountPayable:
          parsedFormDataJson?.totalAmountPayable?.toLocaleString(
            undefined,
            this.twoDecimals,
          ),
        installmentAmount:
          parsedFormDataJson?.installmentAmount?.toLocaleString(
            undefined,
            this.twoDecimals,
          ),

        //Convert strings to title-case
        loanDurationPeriod:
          parsedFormDataJson?.loanDurationPeriod?.charAt(0).toUpperCase() +
          parsedFormDataJson?.loanDurationPeriod?.substr(1).toLowerCase(),
        installmentFrequency:
          parsedFormDataJson?.installmentFrequency?.charAt(0).toUpperCase() +
          parsedFormDataJson?.installmentFrequency?.substr(1).toLowerCase(),
        emis: formatedEmis,
      },
      columnheadings: columnheadings,
      applicationDateTime: moment(
        parsedFormDataJson?.applicationDateTime,
      )?.format('DD.MM.YYYY'),
      content: content,
      currentTimestamp: `${moment(moment.now())
        .utcOffset('+0300')
        .format('DD.MM.YYYY')}`,
    };

    const path = `./tmpStatemnt/loan-application-form-${moment()
      .utc()
      .format('DDMMYYYY')}-${formData.loanId}.pdf`;

    const template: HandlebarsTemplateDelegate =
      Handlebars.compile(htmlTemplate);
    const renderedHTML = template(data);

    return (await this.pdf(renderedHTML, path)) ? path : null;
  }

  async pdf(
    html: string,
    path: string,
    customOptions?: PDFOptions,
  ): Promise<Buffer> {
    const options: PDFOptions = customOptions || {
      format: 'A4',
      path: path,
      printBackground: true,
      margin: {
        top: '55px',
        right: '50px',
        bottom: '55px',
        left: '50px',
      },
    };
    try {
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox'],
        ignoreDefaultArgs: ['--disable-extensions'],
      });
      const page = await browser.newPage();
      const waitUntil = 'networkidle2';
      await page.setContent(html, { waitUntil });
      page.setDefaultNavigationTimeout(0);
      // generate PDF
      const pdfBuffer = await page.pdf(options);
      await browser.close();
      return pdfBuffer;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  checkMissingKeys(objectToCheck: object, expectedKeys: string[]) {
    //ensure keys are present
    const missingKeys = expectedKeys.filter(
      (expectedKey) => !objectToCheck.hasOwnProperty(expectedKey),
    );
    if (missingKeys?.length != 0) {
      this.logger.error('There are missing keys in the LOS jsonData');
      this.logger.error(missingKeys);
      // throw new Error ('Missing Object Keys')
    }
  }
  async convertToTitleCase(str: string): Promise<string> {
    if (!str) {
      return '';
    }
    return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
  }
}
