import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig, toFormData } from 'axios';
import FormData from 'form-data';
import { lastValueFrom, map } from 'rxjs';
import { IFSService } from '../../domain/services/fsService.interface';
import { FSCreateTicketDTO } from '../controllers/customers/dtos/fsCreateTicket.dto';
import { FSCreateTicketResponseDTO } from '../controllers/customers/dtos/fsCreateTicketResponse.dto';
import * as fs from 'fs';

@Injectable()
export class FSService implements IFSService {
  private readonly logger = new Logger(FSService.name);
  private FS_BASE_URL: string;
  private FS_API_KEY: string;
  private requestConfig: AxiosRequestConfig;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.FS_BASE_URL = this.configService.get<string>('FS_BASE_URL');
    this.FS_API_KEY = this.configService.get<string>('FS_API_KEY');
    this.requestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      auth: {
        username: this.FS_API_KEY,
        password: 'X',
      },
    };
  }

  async getTicketList(
    requester_id: number,
  ): Promise<FSCreateTicketResponseDTO[]> {
    this.logger.log(this.getTicketList.name);

    const listTicketURL: string =
      this.FS_BASE_URL +
      `/api/v2/tickets?requester_id=${requester_id}&order_type=desc`;

    this.logger.log('FS list Base url ' + this.FS_BASE_URL);
    this.logger.log('FS list FUll url ' + listTicketURL);
    const responseData: FSCreateTicketResponseDTO[] = await lastValueFrom(
      this.httpService.get(listTicketURL, this.requestConfig).pipe(
        map((response) => {
          return response.data.tickets;
        }),
      ),
    );
    return responseData;
  }

  async createTicket(
    files: Array<Express.Multer.File>,
    hasAttachments: boolean,
    fsCreateTicketDTO: FSCreateTicketDTO,
  ): Promise<FSCreateTicketResponseDTO> {
    this.logger.log(this.createTicket.name);

    const createTicketURL: string = this.FS_BASE_URL + '/api/v2/tickets';

    this.logger.log('FS create Base url ' + this.FS_BASE_URL);
    this.logger.log('FS create FUll url ' + createTicketURL);
    const bodyFormData = new FormData();
    if (hasAttachments) {
      for await (const file of files) {
        bodyFormData.append('attachments[]', file.buffer, file.originalname);
      }
    }

    toFormData(fsCreateTicketDTO, bodyFormData);

    const responseData: FSCreateTicketResponseDTO = await lastValueFrom(
      this.httpService
        .post(createTicketURL, bodyFormData, this.requestConfig)
        .pipe(
          map((response) => {
            return response.data.ticket;
          }),
        ),
    );
    console.log(responseData);
    return responseData;
  }
}
