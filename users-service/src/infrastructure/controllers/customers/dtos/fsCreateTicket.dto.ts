export class FSCreateTicketDTO {
  name: string;
  phone: string;
  subject: string;
  description: string;
  category: string;
  sub_category: string;
  status: number;
  priority: number;
  source: number;
  custom_fields: any;
}

export class FSCreateTicketWithEmail extends FSCreateTicketDTO {
  email: string;
}

export class FSCreateTicketWithRequestorId extends FSCreateTicketDTO {
  requester_id: number;
}
