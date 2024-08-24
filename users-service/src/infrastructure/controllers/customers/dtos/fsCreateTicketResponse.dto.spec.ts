import { FSCreateTicketResponseDTO } from './fsCreateTicketResponse.dto';

export const generateMockFSCreateTicketResponseDTO = () => {
  const dto = new FSCreateTicketResponseDTO();
  dto.cc_emails = [];
  dto.fwd_emails = [];
  dto.reply_cc_emails = [];
  dto.fr_escalated = false;
  dto.spam = false;
  dto.priority = 1;
  dto.requester_id = 130000082693;
  dto.requested_for_id = 130000082693;
  dto.source = 11;
  dto.status = 2;
  dto.subject = 'Attachment Test 2';
  dto.id = 122;
  dto.type = 'Incident';
  dto.is_escalated = false;
  dto.description = "<div>'welcom'</div>";
  dto.description_text = 'This is another test for attachment';
  dto.category = 'Inquiry';
  dto.sub_category = 'Loan Application';
  dto.item_category = null;
  dto.created_at = new Date(Date.parse('2023-04-08T20:29:40.521Z'));
  dto.updated_at = new Date(Date.parse('2023-04-08T20:29:40.521Z'));
  dto.attachments = [];

  return [dto];
};
it('should pass is it has all the property', async () => {
  const presenter: FSCreateTicketResponseDTO[] =
    generateMockFSCreateTicketResponseDTO();
  expect(presenter[0]).toHaveProperty('cc_emails');
  expect(presenter[0]).toHaveProperty('fwd_emails');
  expect(presenter[0]).toHaveProperty('reply_cc_emails');
  expect(presenter[0]).toHaveProperty('fr_escalated');
  expect(presenter[0]).toHaveProperty('spam');
  expect(presenter[0]).toHaveProperty('priority');
});
