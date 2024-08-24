import { ICustTicketDetails } from '../model/custTicketDetails.interface';

export abstract class ICustTicketDetailsRepository {
  abstract save(
    custTicketDetails: ICustTicketDetails,
  ): Promise<ICustTicketDetails>;
}
