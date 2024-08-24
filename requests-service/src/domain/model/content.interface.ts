import { IBase } from './base.interface';

export interface IContent extends IBase {
  id: string;
  contentName: string;
  contentType: string;
  messageHeader: string;
  message: string;
  messageType: string;
}
