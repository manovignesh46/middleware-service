export abstract class IS3ClientService {
  abstract generatePresignedUrl(
    command: any,
    expiresInSeconds?: number,
  ): Promise<string>;
  abstract getObjectPresignedUrl(
    bucketName: string,
    objectName: string,
  ): Promise<string>;
  abstract pushObjecttoS3(
    bucketName: string,
    sourcePath: string,
    destinationPath: string,
  ): Promise<boolean>;
  abstract getFileNameFromNormalUrl(
    nonPresignedUrl: string,
    bucketName: string,
  ): Promise<string>;
  abstract getFileNameFromSignedUrl(
    signedUrl: string,
    bucketName: string,
  ): Promise<string>;
}
