import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import moment from 'moment';
import { ClientStatus } from '../domain/enum/clientStatus.enum';
import { IdCardStatus } from '../domain/enum/id-card-status.enum';
import { LeadStatus } from '../domain/enum/leadStatus.enum';
import { TicketType } from '../domain/enum/ticketType.enum';
import { ICustFsRegistration } from '../domain/model/custFsRegistration.interface';
import { ICustOtp } from '../domain/model/custOtp.interface';
import { ICustPrimaryDetails } from '../domain/model/custPrimaryDetails.interface';
import { ICustTelco } from '../domain/model/custTelco.interface';
import { ICustTicketDetails } from '../domain/model/custTicketDetails.interface';
import { ICustFsRegistrationRepository } from '../domain/repository/custFsRegistrationRepository.interface';
import { ICustIdCardDetailsRepository } from '../domain/repository/custIdCardDetailsRepository.interface';
import { ICustOtpRepository } from '../domain/repository/custOtpRepository.interface';
import { ICustPrimaryDetailsRepository } from '../domain/repository/custPrimaryDetailsRepository.interface';
import { ICustTelcoRepository } from '../domain/repository/custTelcoRepository.interface';
import { ICustTicketDetailsRepository } from '../domain/repository/custTicketDetailsRepository.interface';
import { ICustToLMSService } from '../domain/services/custToLMSService.interface';
import { ICustToLOSService } from '../domain/services/custToLOSService.interface';
import { ICustomersService } from '../domain/services/customersService.interface';
import { IFSService } from '../domain/services/fsService.interface';
import { ISanctionService } from '../domain/services/sanctionService.interface';
import { CustomerAlreadyExistsError } from '../infrastructure/controllers/common/errors/customer-already-exists.error';
import { LeadNotEnhancedError } from '../infrastructure/controllers/common/errors/lead-not-enhanced.error';
import { DashboardResponseDTO } from '../infrastructure/controllers/customers/dtos/dashboardResponse.dto';
import {
  FSCreateTicketWithEmail,
  FSCreateTicketWithRequestorId,
} from '../infrastructure/controllers/customers/dtos/fsCreateTicket.dto';
import { FSCreateTicketResponseDTO } from '../infrastructure/controllers/customers/dtos/fsCreateTicketResponse.dto';
import { SubmitTicketDTO } from '../infrastructure/controllers/customers/dtos/submitTicket.dto';
import { FSResponsePresenter } from '../infrastructure/controllers/customers/presenters/fsResponse.presenter';
import { GetCustomerFromFullMsisdnPresenter } from '../infrastructure/controllers/customers/presenters/get-customer-from-full-msisdn.presenter';
import { ProfilePersonalDataPresenter } from '../infrastructure/controllers/customers/presenters/profilePersonalData.presenter';
import { CustFsRegistration } from '../infrastructure/entities/custFsRegistration.entity';
import { CustOtp } from '../infrastructure/entities/custOtp.entity';
import { CustPrimaryDetails } from '../infrastructure/entities/custPrimaryDetails.entity';
import { CustTicketDetails } from '../infrastructure/entities/custTicketDetails.entity';
import { AuthServiceClient } from '../infrastructure/services/auth-service-client/auth-service-client.service';
import { getDaysToExpiry, parseDate } from './helpers';
import { PushNotificationService } from '../infrastructure/services/push-notification-service';
import { MTNOptOutDTO } from '../infrastructure/controllers/customers/dtos/mtnOptOut.dto';
import { SendNotificationDto } from '../infrastructure/services/notifiction-service-client/dto/send-notification.dto';
import { TargetType } from '../infrastructure/services/notifiction-service-client/enum/target-type.enum';
import { SourceMicroservice } from '../infrastructure/services/notifiction-service-client/enum/source-microservice.enum';
import { NotificationServiceClient } from '../infrastructure/services/notifiction-service-client/notifications-service-client.service';
import { IContentService } from '../domain/services/content.service.interface';
import { IWhitelistedSchoolRepository } from '../domain/repository/whitelistedSchoolRepository.interface';
import {
  WhitelistedSchoolLabel,
  WhitelistedSchoolPresenter,
} from '../infrastructure/controllers/customers/presenters/whitelistedSchool.presenter';
import { IWhitelistedSchool } from '../domain/model/whitelistedSchool.interface';

@Injectable()
export class CustomersService implements ICustomersService {
  private fsStatus;
  private MTN_UG: string[];
  constructor(
    private readonly custOtpRepository: ICustOtpRepository,
    private readonly sanctionService: ISanctionService,
    private readonly custPriDetailsRepository: ICustPrimaryDetailsRepository,
    private readonly custIdCardDetailsRepository: ICustIdCardDetailsRepository,
    private readonly custTelcoRepository: ICustTelcoRepository,
    private readonly custToLOSService: ICustToLOSService,
    private readonly custToLMSService: ICustToLMSService,
    private configService: ConfigService,
    private authServiceClient: AuthServiceClient,
    private custFsRegistrationRepo: ICustFsRegistrationRepository,
    private custTicketDetailsRepo: ICustTicketDetailsRepository,
    private fsService: IFSService,
    private pushNotificationService: PushNotificationService,
    private readonly notificationServiceClient: NotificationServiceClient,
    private contentService: IContentService,
    private whitelistedSchoolRepo: IWhitelistedSchoolRepository,
  ) {
    this.MTN_UG = JSON.parse(this.configService.get<string>('MTN-UG'));
    this.fsStatus = {
      2: 'Open',
      3: 'Pending',
      4: 'Resolved',
      5: 'Closed',
    };
  }
  async getWhitelistedSchoolList(): Promise<WhitelistedSchoolPresenter> {
    const whitelistedSchoolList: IWhitelistedSchool[] =
      await this.whitelistedSchoolRepo.findAll();
    const presenter: WhitelistedSchoolPresenter =
      new WhitelistedSchoolPresenter();
    let school: WhitelistedSchoolLabel = new WhitelistedSchoolLabel();
    const whitelistedSchoolLabel: WhitelistedSchoolLabel[] = [];
    school.label = 'OTHER';
    school.value = 'OTHER';
    whitelistedSchoolLabel.push(school);
    for await (const whitelistedSchool of whitelistedSchoolList) {
      school = new WhitelistedSchoolLabel();
      school.label = whitelistedSchool.schoolName;
      school.value = whitelistedSchool.schoolName;
      whitelistedSchoolLabel.push(school);
    }
    presenter.whitelistedSchools = whitelistedSchoolLabel;
    return presenter;
  }
  async optOutCustomers(mtnOptOutDTO: MTNOptOutDTO): Promise<number> {
    this.logger.log(this.optOutCustomers.name);
    let isMTNnumber = false;
    let custPrimaryDetails: ICustPrimaryDetails =
      await this.custPriDetailsRepository.findByMsisdn(
        mtnOptOutDTO.countryCode,
        mtnOptOutDTO.msisdn,
      );
    if (!custPrimaryDetails) {
      // invalid customer, no data found
      return 3989;
    }

    const fullMsisdn: string = mtnOptOutDTO.countryCode + mtnOptOutDTO.msisdn;
    for (const mtnUg of this.MTN_UG) {
      if (fullMsisdn.startsWith(mtnUg)) {
        isMTNnumber = true;
        break;
      }
    }
    if (isMTNnumber) {
      const responseCode: number = await this.custToLMSService.optOutCustomer(
        mtnOptOutDTO.countryCode,
        mtnOptOutDTO.msisdn,
      );
      // pulling cust primary details again as it was already update with lms response code inside custToLMS service
      custPrimaryDetails = await this.custPriDetailsRepository.findByMsisdn(
        mtnOptOutDTO.countryCode,
        mtnOptOutDTO.msisdn,
      );

      if (responseCode) {
        custPrimaryDetails.optOutDate = new Date();
        custPrimaryDetails.optOutFeedback = mtnOptOutDTO.optOutFeedback;
        custPrimaryDetails.optOutReason = mtnOptOutDTO.optOutReason;
        await this.custPriDetailsRepository.updateCustomer(custPrimaryDetails);

        if (responseCode === 2000) {
          this.logger.log(
            `Deleting Cognito Credentials for customer: ${custPrimaryDetails.id}`,
          );
          try {
            const res = await this.authServiceClient.deleteCognitoCredentials(
              custPrimaryDetails.id,
            );
            this.logger.debug(res);
          } catch (e) {
            this.logger.error(e); //handle error quietly
          }
        }

        if ([2000, 3991, 3992].includes(responseCode)) {
          const { message: smsMessage, messageHeader } =
            await this.contentService.getOptOutMessageDetails();
          const sendNotificationDto: SendNotificationDto = {
            target:
              custPrimaryDetails.msisdnCountryCode + custPrimaryDetails.msisdn,
            targetType: TargetType.PHONE_NUMBER,
            messageHeader: messageHeader,
            message: smsMessage,
            customerId: custPrimaryDetails.id,
            sourceMicroservice: SourceMicroservice.CUSTOMERS,
            priority: 9,
          };
          await this.notificationServiceClient.sendNotification(
            sendNotificationDto,
          );
        }

        return responseCode;
      }
    } else {
      return 3987;
    }

    return;
  }

  async getAllSupportTicketForCustId(
    custId: string,
  ): Promise<FSResponsePresenter[]> {
    const custFsReg: ICustFsRegistration =
      await this.custFsRegistrationRepo.getByCustId(custId);
    if (custFsReg) {
      // make fs service call and parse and send the response
      const fsTicketResp: FSCreateTicketResponseDTO[] =
        await this.fsService.getTicketList(
          // 130000082850);
          custFsReg.fsRequesterId,
        );

      console.log(fsTicketResp);
      if (fsTicketResp) {
        const presenter: FSResponsePresenter[] = [];
        for await (const fsTciket of fsTicketResp) {
          const dto = new FSResponsePresenter();
          dto.id = fsTciket.id.toString();
          dto.status = this.fsStatus[fsTciket.status];
          dto.subject = fsTciket.subject;
          dto.description = fsTciket.description_text;
          dto.submittedAt = fsTciket.created_at;
          dto.lastUpdatedAt = fsTciket.updated_at;
          dto.category = fsTciket.category;
          dto.subCategory = fsTciket.sub_category;
          presenter.push(dto);
        }
        return presenter;
      }
    }
    return;
  }

  async submitSupportTicket(
    files: Array<Express.Multer.File>,
    custId: string,
    submitTicketDTO: SubmitTicketDTO,
  ): Promise<number> {
    this.logger.log(this.submitSupportTicket.name);

    let totalFileSIze = 0;

    submitTicketDTO.hasAttachments =
      submitTicketDTO.hasAttachments.toString() === 'true';
    if (submitTicketDTO.hasAttachments) {
      for await (const file of files) {
        totalFileSIze = totalFileSIze + file.size * 0.000001; // multiple to convert byte to MB
      }
      console.log('total file size' + totalFileSIze);
      if (
        totalFileSIze >
        (this.configService.get<number>('TICKET_ATTACHMENTS_MAX_SIZE') || 40)
      ) {
        return 7002;
      }
    }

    let custPriDetails: ICustPrimaryDetails =
      await this.custPriDetailsRepository.getByEmail(
        submitTicketDTO.email,
        custId,
      );
    if (custPriDetails) {
      return 7001;
    }
    custPriDetails = await this.custPriDetailsRepository.getByCustomerId(
      custId,
    );
    custPriDetails.email = submitTicketDTO.email;
    await this.custPriDetailsRepository.updateCustomer(custPriDetails);
    // send notification for updating the email

    const custOTP: ICustOtp = await this.custOtpRepository.getById(
      custPriDetails.leadId,
    );

    let custFsReg: ICustFsRegistration =
      await this.custFsRegistrationRepo.getByCustId(custId);

    const custTelco: ICustTelco = await this.custTelcoRepository.findByLeadId(
      custOTP.leadId,
    );

    let fullName: string =
      (custTelco?.firstName || '') +
      ' ' +
      (custTelco?.middleName || ' ') +
      ' ' +
      (custTelco?.lastName || ' ');
    fullName = fullName.trim();

    console.log(fullName);
    let fsCreateTicketDTO = null;
    if (custFsReg) {
      //  if found , call fs api with with reqId
      fsCreateTicketDTO = new FSCreateTicketWithRequestorId();
      fsCreateTicketDTO.requester_id = custFsReg.fsRequesterId;
    } else {
      // call fs api without reqId
      fsCreateTicketDTO = new FSCreateTicketWithEmail();
      fsCreateTicketDTO.email = submitTicketDTO.email;
    }

    fsCreateTicketDTO.name = custOTP.preferredName;
    fsCreateTicketDTO.phone =
      custPriDetails.msisdnCountryCode + custPriDetails.msisdn;
    fsCreateTicketDTO.subject = submitTicketDTO.subject;
    fsCreateTicketDTO.description = submitTicketDTO.message;
    fsCreateTicketDTO.category = submitTicketDTO.category;
    fsCreateTicketDTO.sub_category = submitTicketDTO.subCategory;
    fsCreateTicketDTO.status =
      this.configService.get<number>('TICKET_STATUS') || 2;
    fsCreateTicketDTO.priority =
      this.configService.get<number>('TICKET_PRIORITY') || 2;
    fsCreateTicketDTO.source =
      this.configService.get<number>('TICKET_SOURCE') || 11;
    fsCreateTicketDTO.custom_fields = { customer_name: fullName };

    const fsCreateTicketRes: FSCreateTicketResponseDTO =
      await this.fsService.createTicket(
        files,
        submitTicketDTO.hasAttachments,
        fsCreateTicketDTO,
      );

    const custTcktDetails: ICustTicketDetails = new CustTicketDetails();
    custTcktDetails.custId = custId;
    custTcktDetails.custCountryCode = custOTP.msisdnCountryCode;
    custTcktDetails.custMsisdn = custOTP.msisdn;
    custTcktDetails.tktType = TicketType.INC; // chec;
    custTcktDetails.tktSubject = fsCreateTicketDTO.subject;
    custTcktDetails.tktDescription = fsCreateTicketDTO.description;
    custTcktDetails.tktCategory = fsCreateTicketDTO.category;
    custTcktDetails.tktSubCategory = fsCreateTicketDTO.sub_category;
    custTcktDetails.hasAttachments = submitTicketDTO.hasAttachments.valueOf();
    custTcktDetails.attachmentsCount =
      submitTicketDTO.attachmentFilenames?.length || 0;
    custTcktDetails.attachmentsFilenames =
      submitTicketDTO.attachmentFilenames?.toString() || '';
    custTcktDetails.isSentToFs = true;
    custTcktDetails.sentToFsAt = new Date();
    custTcktDetails.respHttpStatusCode = 0;
    custTcktDetails.respErrorBody = '';
    custTcktDetails.tktRequesterId = fsCreateTicketRes.requester_id;
    custTcktDetails.tktRequestedForId = fsCreateTicketRes.requested_for_id;
    custTcktDetails.ticketId = fsCreateTicketRes.id;
    custTcktDetails.tktAttachmentsDetails = '';
    custTcktDetails.tktStatus = fsCreateTicketRes.status.toString();
    custTcktDetails.tktCreatedAt = fsCreateTicketRes.created_at;
    custTcktDetails.tktUpdatedAt = fsCreateTicketRes.updated_at;
    custTcktDetails.createdAt = new Date();
    custTcktDetails.updatedAt = new Date();

    await this.custTicketDetailsRepo.save(custTcktDetails);
    custFsReg = await this.custFsRegistrationRepo.getByRequesterId(
      custTcktDetails.tktRequesterId,
    );
    if (!custFsReg) {
      custFsReg = new CustFsRegistration();
      custFsReg.custCountryCode = custTcktDetails.custCountryCode;
      custFsReg.custId = custId;
      custFsReg.custMsisdn = custTcktDetails.custMsisdn;
      custFsReg.fsIsActive = true;
      custFsReg.fsRequesterId = custTcktDetails.tktRequesterId;
      custFsReg.primaryEmail = custPriDetails.email;

      this.custFsRegistrationRepo.save(custFsReg);
    }
    return 2000;
  }

  async getProfilePersonalData(
    custId: string,
  ): Promise<ProfilePersonalDataPresenter> {
    this.logger.log(this.getProfilePersonalData.name);
    const custPrimaryDetails: ICustPrimaryDetails =
      await this.custPriDetailsRepository.getByCustomerId(custId);
    const custTelco: ICustTelco = await this.custTelcoRepository.findByLeadId(
      custPrimaryDetails.leadId,
    );
    const presenter: ProfilePersonalDataPresenter =
      new ProfilePersonalDataPresenter();

    presenter.firstName = custTelco.firstName;
    presenter.givenName = custTelco.givenName;

    const dob = parseDate(custTelco.dob);
    presenter.dob = moment(dob).format('DD.MM.YYYY');
    presenter.nin = custTelco.nationalIdNumber;
    presenter.ninExpiryDate = custTelco.idExpiry;
    presenter.msisdn = custTelco.msisdn;

    presenter.gender =
      custTelco.nationalIdNumber?.charAt(1) === 'M' ? 'MALE' : 'FEMALE';

    presenter.emailId = custPrimaryDetails.email;

    return presenter;
  }

  async getCustFromFullMsisdn(
    fullMsisdn: string,
  ): Promise<GetCustomerFromFullMsisdnPresenter> {
    const custOtp = await this.custOtpRepository.findLeadByFullMsisdnConcat(
      fullMsisdn,
    );
    if (!custOtp) {
      return null;
    }
    let custPrimaryDetails: ICustPrimaryDetails;
    if (custOtp) {
      custPrimaryDetails =
        await this.custPriDetailsRepository.getCustomerByLeadId(
          custOtp?.leadId,
        );
    }

    const { leadId, msisdnCountryCode, msisdn, preferredName, email } =
      custOtp || {}; // in case custOtp is null
    const customerId: string = custPrimaryDetails?.id;
    const cognitoId = custPrimaryDetails?.cognitoId;

    const presenter: GetCustomerFromFullMsisdnPresenter = {
      msisdnCountryCode,
      msisdn,
      preferredName,
      email,
      customerId,
      leadId,
      cognitoId,
      clientStatus: custPrimaryDetails?.clientStatus,
    };
    return presenter;
  }
  async getCustId(msisdnCountryCode: string, msisdn: string): Promise<string> {
    const custOtp: ICustOtp = await this.custOtpRepository.getByMsisdn(
      msisdnCountryCode,
      msisdn,
    );
    const custPrimaryDetails: ICustPrimaryDetails =
      await this.custPriDetailsRepository.getCustomerByLeadId(custOtp.leadId);
    return custPrimaryDetails.id;
  }
  async getMsisdn(customerId: string): Promise<{
    msisdnCountryCode: string;
    msisdn: string;
    preferredName: string;
    availableCreditLimit: number;
  }> {
    const { msisdnCountryCode, msisdn, leadId, availableCreditLimit } =
      await this.custPriDetailsRepository.getByCustomerId(customerId);
    this.logger.log('new codes up in user service');
    this.logger.log('available credit limit : ' + availableCreditLimit);
    const { preferredName } = await this.custOtpRepository.getById(leadId);
    return { msisdnCountryCode, msisdn, preferredName, availableCreditLimit };
  }
  async getTargetApiUuid(customerId: any): Promise<string> {
    const custPrimaryDetails: CustPrimaryDetails =
      await this.custPriDetailsRepository.getByCustomerId(customerId);

    const custOtp: CustOtp = await this.custOtpRepository.getById(
      custPrimaryDetails.leadId,
    );

    return custOtp?.targetApiUUID;
  }
  private readonly logger = new Logger(CustomersService.name);

  async createCustomerFromEnhancedLead(
    msisdnCountryCode: string,
    msisdn: string,
  ): Promise<ICustPrimaryDetails> {
    const custOtp: ICustOtp = await this.custOtpRepository.getByMsisdn(
      msisdnCountryCode,
      msisdn,
    );
    if (custOtp.leadCurrentStatus !== LeadStatus.LEAD_ENHANCED) {
      throw new LeadNotEnhancedError('Lead not lead enhanced');
    }
    const existingCustomerWithLeadId =
      await this.custPriDetailsRepository.getCustomerByLeadId(custOtp.leadId);

    if (existingCustomerWithLeadId) {
      throw new CustomerAlreadyExistsError(
        'Customer with same Lead ID Mapping Already exists',
      );
    }
    const telcoKyc = await this.custTelcoRepository.findByLeadId(
      custOtp.leadId,
    );
    if (!telcoKyc) {
      throw new Error('Customer does not have any stored Telco KYC data');
    }

    //Call LOS first before updating DB in case the request fails
    await this.custToLOSService.pinCreationInLOS(custOtp.leadId, true);

    //Create entry in cust primary details table
    const newCustomer: ICustPrimaryDetails = new CustPrimaryDetails();
    newCustomer.clientStatus = ClientStatus.ACTIVE;
    //details from lead (custOtp)
    newCustomer.leadId = custOtp.leadId;
    newCustomer.msisdnCountryCode = custOtp.msisdnCountryCode;
    newCustomer.msisdn = custOtp.msisdn;
    newCustomer.nationalIdNumber = custOtp.nationalIdNumber;
    newCustomer.preferredName = custOtp.preferredName;
    newCustomer.email = custOtp.email;
    //details from telco KYC
    newCustomer.givenName = telcoKyc.givenName;
    newCustomer.surname = telcoKyc.lastName;
    newCustomer.nationality = telcoKyc.nationality;
    newCustomer.gender = telcoKyc.gender;
    newCustomer.dateOfBirth = parseDate(telcoKyc.dob).toDate();
    newCustomer.dateOfExpiry = telcoKyc.idExpiry;
    newCustomer.idExpiryDays = getDaysToExpiry(telcoKyc.idExpiry);
    if (newCustomer.idExpiryDays && newCustomer.idExpiryDays >= 1) {
      newCustomer.idStatus = IdCardStatus.ACTIVE;
    } else {
      newCustomer.idStatus = IdCardStatus.EXPIRED;
    }
    this.logger.log(
      `ID Card Days to Expiry: ${newCustomer.idExpiryDays}.Status is ${newCustomer.idStatus} `,
    );

    const savedCustomer: ICustPrimaryDetails =
      await this.custPriDetailsRepository.create(newCustomer);

    //update lead status
    await this.custOtpRepository.update({
      ...custOtp,
      leadCurrentStatus: LeadStatus.LEAD_ONBOARDED,
    });

    //Update user device repo
    await this.pushNotificationService.convertLeadIdToCustomerId(
      custOtp.leadId,
      savedCustomer.id,
    );

    return savedCustomer;
  }

  async deleteCustomer(customerId: string): Promise<ICustPrimaryDetails> {
    const customerToDelete =
      await this.custPriDetailsRepository.getByCustomerId(customerId);
    const custOtp = await this.custOtpRepository.getById(
      customerToDelete.leadId,
    );
    await this.custOtpRepository.update({
      ...custOtp,
      leadCurrentStatus: LeadStatus.LEAD_ENHANCED,
    });
    return this.custPriDetailsRepository.deleteCustomer(customerId);
  }

  async updateCustomer(
    customerId: string,
    cognitoId: string,
  ): Promise<ICustPrimaryDetails> {
    const existingCust = await this.custPriDetailsRepository.getByCustomerId(
      customerId,
    );
    return this.custPriDetailsRepository.updateCustomer({
      ...existingCust,
      cognitoId,
    });
  }

  async dashBoardDetails(customerId: string): Promise<DashboardResponseDTO> {
    const customerPrimaryDetails: ICustPrimaryDetails =
      await this.custPriDetailsRepository.getCustomerByCustomerId(customerId);
    if (customerPrimaryDetails !== null) {
      const custOtp: ICustOtp = await this.custOtpRepository.getById(
        customerPrimaryDetails.leadId,
      );

      let response: DashboardResponseDTO = new DashboardResponseDTO();
      response = await this.custToLMSService.getDashboardDetails(
        customerPrimaryDetails,
      );

      const devices = await this.authServiceClient.getDevices(customerId);
      const lastLoginDateInMs: number = Math.max(
        ...devices.map((device) => {
          return new Date(device.lastActiveSession).getTime();
        }),
      );

      if (lastLoginDateInMs) {
        response.dashBoardPresenter.lastLoginTime = new Date(lastLoginDateInMs);
      } else {
        response.dashBoardPresenter.lastLoginTime = null;
      }

      response.dashBoardPresenter.msisdn = customerPrimaryDetails.msisdn;
      response.dashBoardPresenter.countryCode =
        customerPrimaryDetails.msisdnCountryCode;
      response.dashBoardPresenter.preferredName = custOtp.preferredName;
      response.dashBoardPresenter.custNIN = custOtp.nationalIdNumber;
      // response.dashBoardPresenter.studentsDetails =
      //   await this.studentDetailsService.getAllStudent(customerId);

      return response;
    }

    return undefined;
  }

  async getSanction(name: string) {
    this.logger.log(this.getSanction);
    const sanction = await this.sanctionService.getSanctionDetails(name);
    return sanction;
  }
}
