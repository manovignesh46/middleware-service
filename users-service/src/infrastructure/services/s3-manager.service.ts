import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ICredentialHelper } from '../../domain/services/credential.service.interface';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';

@Injectable()
export class S3ManagerService {
  private logger = new Logger(S3ManagerService.name);
  private client: S3Client;
  private region: string;
  constructor(
    private configService: ConfigService,
    private credentialHelper: ICredentialHelper,
  ) {
    this.region = this.configService.get<string>('AWS_REGION');
    const awsCredentials = this.credentialHelper.getCredentials();
    this.client = new S3Client({
      credentials: awsCredentials,
      region: this.region,
    });
  }

  async listBucketContents(bucket: string) {
    // const response = await this.s3.listObjectsV2({ Bucket: bucket }).promise();
    // return response.Contents.map((c) => c.Key);
    return;
  }

  async uploadFile(bucket: string, filename: string, content: string) {
    this.logger.log(this.uploadFile.name);
    // await this.s3
    //   .upload({
    //     Bucket: bucket,
    //     Key: filename,
    //     Body: content,
    //   })
    //   .promise();
    return;
  }

  async generatePresignedUrl(
    bucketName: string,
    imageFileName: string,
  ): Promise<string> {
    const presignedUrlValidSeconds = 300;
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: imageFileName,
    });
    return getSignedUrl(this.client, command, {
      expiresIn: presignedUrlValidSeconds,
    });
  }

  getObjectNormalUrl(bucketName: string, objectName: string) {
    const url = new URL(
      `https://${bucketName}.s3.${this.region}.amazonaws.com`,
    );
    url.pathname = path.join(url.pathname, objectName);
    return url.toString();
  }
}
