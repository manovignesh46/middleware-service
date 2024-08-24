import { IContent } from '../content.interface';

export const mockContent: IContent = {
  id: '8a653ab6-a5b9-432d-957f-988e0f02cd2e',
  contentName: 'OTP_SMS',
  contentType: 'OTP',
  messageHeader: 'My Header',
  message: 'Your OTP is ${otp}.',
  messageType: 'text',
  createdAt: new Date(Date.parse('2023-04-08T20:29:40.521Z')),
  updatedAt: new Date(Date.parse('2023-04-08T20:29:40.521Z')),
};
