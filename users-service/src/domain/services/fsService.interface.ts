import { FSCreateTicketDTO } from '../../infrastructure/controllers/customers/dtos/fsCreateTicket.dto';
import { FSCreateTicketResponseDTO } from '../../infrastructure/controllers/customers/dtos/fsCreateTicketResponse.dto';

export abstract class IFSService {
  abstract createTicket(
    files: Array<Express.Multer.File>,
    hasAttachments: boolean,
    fsCreateTicketDTO: FSCreateTicketDTO,
  ): Promise<FSCreateTicketResponseDTO>;

  abstract getTicketList(
    requester_id: number,
  ): Promise<FSCreateTicketResponseDTO[]>;
}
