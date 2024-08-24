import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { IdType } from '../../domain/enum/id-type.enum';
import { ICustTelcoTransaction } from '../../domain/model/custTelcoTransaction.interface';
import { ICustTelcoTransactionRepository } from '../../domain/repository/custTelcoTransactionRepository.interface';
import { ITelcoService } from '../../domain/services/telcoService.interface';
import { CustTelcoTransaction } from '../entities/custTelcoTransaction.entity';
import { ICustTelco } from '../../domain/model/custTelco.interface';
import { CustTelco } from '../entities/custTelco.entity';
import { TelcoKYCResp } from '../controllers/customers/dtos/telcoKycResp.dto';
import { Gender } from '../../domain/enum/gender.enum';
import { MatchStatus } from '../../domain/enum/matchStatus.enum';
import { ICustTelcoRepository } from '../../domain/repository/custTelcoRepository.interface';
import { TelcoTransactionResp } from '../controllers/customers/dtos/telcoTransactionResp.dto';

@Injectable()
export class TelcoService implements ITelcoService {
  private readonly logger = new Logger(TelcoService.name);

  private TELCO_BASE_URL: string;
  private TELCO_KYC_URL: string;
  private TELCO_TRANSACTION_URL: string;
  private requestConfig: AxiosRequestConfig;

  constructor(
    private readonly custTelcoTransactionRespository: ICustTelcoTransactionRepository,
    private readonly custTelcoRepository: ICustTelcoRepository,
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.TELCO_BASE_URL = this.configService.get<string>('TELCO_BASE_URL');
    this.TELCO_TRANSACTION_URL = this.configService.get<string>(
      'TELCO_TRANSACTION_URL',
    );
    this.TELCO_KYC_URL = this.configService.get<string>('TELCO_KYC_URL');
    this.requestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async findTelcoTransaction(
    leadId: string,
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<ICustTelcoTransaction> {
    msisdnCountryCode = msisdnCountryCode.replace('+', '');
    const telcoTransactionFullURL =
      this.TELCO_BASE_URL +
      this.TELCO_TRANSACTION_URL +
      `?countrycode=${msisdnCountryCode}&msisdn=${msisdn}`;

    this.logger.log('telcoTransactionFullURL api');
    this.logger.log(msisdnCountryCode + msisdn);
    this.logger.log(telcoTransactionFullURL);

    const responseData: TelcoTransactionResp = await lastValueFrom(
      this.httpService.get(telcoTransactionFullURL, this.requestConfig).pipe(
        map((response) => {
          return response.data[0];
        }),
      ),
    );

    this.logger.log('telcoTransactionFullURL api response');
    this.logger.log(responseData);

    if (responseData) {
      const custTelcoTransaction: ICustTelcoTransaction =
        new CustTelcoTransaction();

      custTelcoTransaction.idType = IdType.LEAD;
      custTelcoTransaction.idValue = leadId;
      custTelcoTransaction.isActive = true;
      custTelcoTransaction.transactionData = JSON.stringify(responseData);
      custTelcoTransaction.isDataSentToLOS = false;
      custTelcoTransaction.telcoId = responseData.id.toString();

      return this.custTelcoTransactionRespository.save(custTelcoTransaction);
    }
  }

  async findTelcoKYC(
    leadId: string,
    msisdnCountryCode: string,
    msisdn: string,
    nin: string,
  ): Promise<ICustTelco> {
    this.logger.log(this.findTelcoKYC.name);
    msisdnCountryCode = msisdnCountryCode.replace('+', '');
    const telcoKycFullURL =
      this.TELCO_BASE_URL +
      this.TELCO_KYC_URL +
      `?countrycode=${msisdnCountryCode}&msisdn=${msisdn}`;

    this.logger.log('telcoKyc api ');
    this.logger.log(msisdnCountryCode + msisdn);
    this.logger.log(telcoKycFullURL);

    const responseData: TelcoKYCResp = await lastValueFrom(
      this.httpService.get(telcoKycFullURL, this.requestConfig).pipe(
        map((response) => {
          return response.data[0];
        }),
      ),
    );

    this.logger.log('telcoKyc api response');
    this.logger.log(responseData);

    if (responseData) {
      const custTelco: ICustTelco = new CustTelco();
      custTelco.idType = IdType.LEAD;
      custTelco.idValue = leadId;
      custTelco.firstName = responseData.firstname;
      custTelco.lastName = responseData.lastname;
      custTelco.givenName = responseData.givenname;
      custTelco.msisdn = responseData.msisdn.toString();
      custTelco.msisdnCountryCode = '+' + responseData.countrycode.toString();
      custTelco.nationalIdNumber = responseData.nin;
      custTelco.nationality = responseData.nationality;
      custTelco.dob = responseData.dob;
      custTelco.registrationDate = responseData.registration;
      custTelco.gender =
        responseData.gender === 'M' ? Gender.MALE : Gender.FEMALE;
      custTelco.telcoId = responseData.id.toString();
      custTelco.ninComparison =
        responseData.nin.toString() === nin
          ? MatchStatus.MATCHED
          : MatchStatus.NOT_MATCHED;
      this.logger.log(`End ${this.findTelcoKYC.name}`);
      return this.custTelcoRepository.save(custTelco);
    }
    return null;
  }
}
