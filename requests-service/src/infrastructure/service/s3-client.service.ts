import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { ICredentialHelper } from '../../domain/service/credential.service.interface';
import { IS3ClientService } from '../../domain/service/s3-client-service.interface';
import path from 'path';

@Injectable()
export class S3ClientService implements IS3ClientService {
  private logger = new Logger(S3ClientService.name);
  private client: S3Client;
  private region: string;
  constructor(
    private readonly credentialHelper: ICredentialHelper,
    private readonly configService: ConfigService,
  ) {
    this.region = this.configService.get<string>('AWS_REGION') || 'eu-west-1';
    const credentials = credentialHelper.getCredentials();
    this.client = new S3Client({ credentials, region: this.region });
  }

  async pushObjecttoS3(
    bucketName: string,
    sourcePath: string,
    destinationPath: string,
  ): Promise<boolean> {
    this.logger.log(this.pushObjecttoS3.name);
    const buf = fs.createReadStream(sourcePath);
    const input = {
      Body: buf,
      Bucket: bucketName,
      Key: destinationPath,
      contentType: 'application/pdf',
    };
    try {
      const command = new PutObjectCommand(input);
      const response = await this.client.send(command);
      this.logger.log(response);
      return response.$metadata.httpStatusCode === 200;
    } catch (error) {
      this.logger.error(error);
    }
    return false;
  }

  generatePresignedUrl(
    command: any,
    expiresInSeconds?: number,
  ): Promise<string> {
    return getSignedUrl(this.client, command, {
      expiresIn: expiresInSeconds || 604800, //default of 7 day expiry
    });
  }

  getObjectNormalUrl(bucketName: string, objectName: string) {
    const url = new URL(
      `https://${bucketName}.s3.${this.region}.amazonaws.com`,
    );
    url.pathname = path.join(url.pathname, objectName);
    return url.toString();
  }

  getObjectPresignedUrl(
    bucketName: string,
    objectName: string,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectName,
    });
    return this.generatePresignedUrl(command);
  }

  async getFileNameFromNormalUrl(
    nonPresignedUrl: string,
    bucketName: string,
  ): Promise<string> {
    if (nonPresignedUrl) {
      const baseUrl = `https://${bucketName}.s3.${this.region}.amazonaws.com/`;
      return nonPresignedUrl.replace(baseUrl, '');
    }
    return '';
  }

  async getFileNameFromSignedUrl(
    signedUrl: string,
    bucketName: string,
  ): Promise<string> {
    if (signedUrl) {
      const splittedString: string[] = signedUrl.split('?');
      const nonPresignedUrl = splittedString[0];
      return this.getFileNameFromNormalUrl(nonPresignedUrl, bucketName);
    }
    return '';
  }
}
