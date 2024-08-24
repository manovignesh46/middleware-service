import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client } from 'nestjs-soap';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';
import { getTimestamp } from '../../usecases/helpers';

@Injectable()
export class SoapService {
  constructor(
    @Inject('SUNLYTE_CLIENT') private readonly mySoapClient: Client,
    private readonly configService: ConfigService,
  ) {}
  private logger = new Logger(SoapService.name);

  //Constants
  private CHANNEL_CODE =
    this.configService.get('SUNLYTE_CHANNEL_CODE') || 'STANCHAT';
  private SERVICE_CODE =
    this.configService.get('SUNLYTE_SERVICE_CODE') ||
    'STANDCHART_SCHOOLPAY_STUDENT_VALIDATION';
  private ENTRY_KEY =
    this.configService.get('SUNLYTE_ENTRY_KEY') || 'IN_STUDENT_PAYMENT_CODE';

  //Secrets
  private API_KEY = this.configService.get('SUNLYTE_API_KEY') || 'st4nch4rt';

  async validateStudentAccount(studentAccountNumber: string) {
    this.logger.log(this.validateStudentAccount.name);
    const { messageSignature, currentTimestamp } = this.getMessageSignature();
    const requestReference = uuidv4();
    const requestBody = {
      request: {
        authorization: {
          channelCode: this.CHANNEL_CODE,
          channelRequestDigest: messageSignature,
          channelRequestTimestamp: currentTimestamp,
        },
        request: {
          requestReference: requestReference,
          serviceCode: this.SERVICE_CODE,
          serviceInputs: {
            importParams: {
              entry: {
                key: this.ENTRY_KEY,
                value: studentAccountNumber,
              },
            },
          },
        },
      },
    };
    this.logger.log(requestBody);
    const response: any = await new Promise((resolve, reject) => {
      this.mySoapClient.ChannelSoapWs.ChannelSoapWsPort.ChannelService(
        requestBody,
        (err, res) => {
          if (err) {
            this.logger.error(err);
            reject(err);
          }
          resolve(res);
        },
      );
    });
    this.logger.log(response);
    if (response?.return?.returnCode !== 0) {
      this.logger.error(
        `Response code from Sunlyte is ${response?.return?.returnCode}`,
      );
      throw new Error(
        response?.return?.returnMessage ||
          'An Error Occurred when Getting Student Account Details',
      );
    }
    const responseEntryArray =
      response.return.serviceOutput.exportParameters.entry;
    const responseBody = this.keyValueArrayToObject(responseEntryArray);
    this.logger.log(responseBody);
    return responseBody;
  }

  //Signature and timestamp to use in the channelRequestDigest and channelRequestTimestamp respectively
  private getMessageSignature(): {
    messageSignature: string;
    currentTimestamp: string;
  } {
    this.logger.log(this.getMessageSignature.name);
    const currentTimestamp = getTimestamp();
    const stringToSign = currentTimestamp + this.API_KEY;
    const messageSignature = CryptoJS.SHA256(stringToSign).toString(
      CryptoJS.enc.Hex,
    );
    return { messageSignature, currentTimestamp };
  }

  //Coverts a list of [{key: 'myKey', value: 'myValue'}] objects to {myKey: myValue}
  private keyValueArrayToObject(
    keyValueObjectArray: { key: string; value: string }[],
  ) {
    this.logger.log(this.keyValueArrayToObject.name);
    const output = {};
    for (const item of keyValueObjectArray) {
      const { key, value } = item;
      output[key] = value;
    }
    return output;
  }
}
