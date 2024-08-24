import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DedupStatus } from '../domain/enum/dedupStatus.enum';
import { LeadStatus } from '../domain/enum/leadStatus.enum';
import { OtpType } from '../domain/enum/otpType.enum';
import { ResponseMessage } from '../domain/enum/responseMessage.enum';
import { TelcoOpType } from '../domain/enum/telcoOp.enum';
import { ICustOtp } from '../domain/model/custOtp.interface';
import { ICustOtpRepository } from '../domain/repository/custOtpRepository.interface';
import { IWhitelistedStudentDetailsRepository } from '../domain/repository/whitelistedStudentDetailsRepository.interface';
import { ICustDedupService } from '../domain/services/custDedupService.interface';
import { INotificationService } from '../domain/services/notificationsService.interface';
import { ITriggerOtpService } from '../domain/services/triggerOtp.interface';
import { ErrorMessage } from '../infrastructure/controllers/common/errors/enums/errorMessage.enum';
import { OtpLockedError } from '../infrastructure/controllers/common/errors/otpLocked.error';
import { TriggerOtpServiceDto } from '../infrastructure/controllers/customers/dtos/triggerOtpService.dto';
import {
  WhiteListedStudentDetailsDTO,
  WhitelistedDTO,
} from '../infrastructure/controllers/customers/dtos/whitelisted.dto';
import { CustOtp } from '../infrastructure/entities/custOtp.entity';
import { AggregatorWhiteListingService } from '../infrastructure/services/aggregatorWhitelisting.service';

import { Gender } from '../domain/enum/gender.enum';
import { MTNValidationStatus } from '../domain/enum/mtn-validation-status.enum';
import { WhitelistStatus } from '../domain/enum/whitelistStatus.enum';
import { IWhitelistedSchool } from '../domain/model/whitelistedSchool.interface';
import { IWhitelistedStudentDetails } from '../domain/model/whitelistedStudentDetails.interface';
import { IWhitelistedSchoolRepository } from '../domain/repository/whitelistedSchoolRepository.interface';
import { IMtnService } from '../domain/services/mtn.service.interface';
import { MTNApprovalPollingDTO } from '../infrastructure/controllers/customers/dtos/mtnApprovalPolling.dto';
import { MTNApprovalServiceDTO } from '../infrastructure/controllers/customers/dtos/mtnApprovalService.dto';
import { SchoolPayWhitelistResponse } from '../infrastructure/controllers/customers/dtos/schoolpay-whitelisting-response.dto';
import { TriggerOtpDto } from '../infrastructure/controllers/customers/dtos/triggerOtp.dto';
import { WhitelistedStudentDetails } from '../infrastructure/entities/whitelistedStudentDetails.entity';
import { PushNotificationService } from '../infrastructure/services/push-notification-service';
import { generateOTP, getTimeToUnlockMinutes } from './helpers';

@Injectable()
export class TriggerOtpService implements ITriggerOtpService {
  private OTP_LOCKED_COOLOFF_SECONDS: number;
  private MTN_UG: string[];
  private AIRTEL_UG: string[];
  private REGISTER_OTP_MAX_RETRIES: number;
  private SCHOOL_WHITELISTING_CHECK: boolean;

  constructor(
    private configService: ConfigService,
    private readonly notificationService: INotificationService,
    private readonly custOtpRepository: ICustOtpRepository,
    private readonly custDedupService: ICustDedupService,
    private readonly whitelistingService: AggregatorWhiteListingService,
    private readonly whitelistStudentDetailsRepo: IWhitelistedStudentDetailsRepository,
    private readonly mtnService: IMtnService,
    private readonly pushNotificationService: PushNotificationService,
    private readonly whitelistedSchoolRepo: IWhitelistedSchoolRepository,
  ) {
    this.MTN_UG = JSON.parse(this.configService.get<string>('MTN-UG'));
    this.AIRTEL_UG = JSON.parse(this.configService.get<string>('AIRTEL-UG'));
    this.OTP_LOCKED_COOLOFF_SECONDS =
      configService.get<number>('OTP_LOCKED_COOLOFF_SECONDS') || 7200; //default cooloff time is 2h,
    this.REGISTER_OTP_MAX_RETRIES =
      configService.get<number>('REGISTER_OTP_MAX_RETRIES') || 3; //default max OTP sent is 3,
    this.SCHOOL_WHITELISTING_CHECK =
      this.configService.get<string>('SCHOOL_WHITELISTING_CHECK') === 'true';
  }
  async mtnApprovalPolling(
    mtnApporvalPollingDTO: MTNApprovalPollingDTO,
  ): Promise<MTNApprovalServiceDTO> {
    let custOtp: ICustOtp =
      await this.custOtpRepository.findLeadByMsisdnApprovalId(
        mtnApporvalPollingDTO.countryCode,
        mtnApporvalPollingDTO.msisdn,
        mtnApporvalPollingDTO.approvalId,
      );

    if (custOtp) {
      if (
        custOtp?.mtnValidationStatus === MTNValidationStatus.VALIDATION_SUCCESS
      ) {
        const otpType = OtpType.SMS;
        custOtp = await this.sendAndSaveOtp({
          ...custOtp,
          otpType,
        });
        const { deviceId, deviceToken, deviceOs } = mtnApporvalPollingDTO;
        if (deviceId && deviceToken && deviceOs) {
          //Register Device for push notifications
          const userDevice =
            await this.pushNotificationService.registerDeviceForPushNotifications(
              {
                deviceId,
                deviceOs,
                firebaseToken: deviceToken,
                leadId: custOtp.leadId,
              },
            );
          /*
          userDevice will be null if there were no changes to userDevice properties
          and platform app endpoint exists
          */
          if (userDevice) {
            await this.pushNotificationService.unenrolAllTopics(userDevice);
            await this.pushNotificationService.enrolTopic(userDevice); //general push topic is subscribed if no TopicARN is provided
          }
        } else {
          this.logger.log(
            'MTN Approval :: Device Info is not present for ApprovalId :: ' +
              mtnApporvalPollingDTO.approvalId,
          );
        }
        return new MTNApprovalServiceDTO(custOtp, false, false);
      } else if (
        custOtp?.mtnValidationStatus === MTNValidationStatus.VALIDATION_FAILED
      ) {
        return new MTNApprovalServiceDTO(null, true, false);
      } else {
        return new MTNApprovalServiceDTO(null, false, true);
      }
    }
    return null;
  }

  async resumeAction(
    msisdn: string,
    msisdnCountryCode: string,
  ): Promise<TriggerOtpServiceDto> {
    const otpType = OtpType.SMS;
    let updatedLead: ICustOtp = new CustOtp();
    // eslint-disable-next-line prefer-const
    let { responseStatus: dedupStatus, custOtp: existingCustOtp } =
      await this.custDedupService.checkWIPDedup(
        null, //NIN must be null to skip the msisdn / nin check in custDedupService
        msisdnCountryCode,
        msisdn,
        null,
      );

    this.logger.log(existingCustOtp);

    if (DedupStatus.WIP === dedupStatus) {
      const { isOtpLocked, custOtp } = await this.checkIsOtpLocked(
        existingCustOtp,
      );
      existingCustOtp = custOtp; //update existingCustOtp object
      if (isOtpLocked) {
        //Throw error if otp is locked
        const timeToUnlockMinutes = getTimeToUnlockMinutes(
          existingCustOtp.lockedAt || existingCustOtp.otpSentLockedAt,
          this.OTP_LOCKED_COOLOFF_SECONDS,
        );
        throw new OtpLockedError(ErrorMessage.OTP_LOCK, timeToUnlockMinutes);
      } else {
        updatedLead = await this.sendAndSaveOtp({
          ...existingCustOtp,
          otpType,
        });
      }
    }

    return new TriggerOtpServiceDto(
      updatedLead,
      dedupStatus,
      null,
      null,
      null,
      false,
      null,
      null,
      null,
    );
  }

  private readonly logger = new Logger(TriggerOtpService.name);
  async triggerOtp(
    triggerOtpDto: TriggerOtpDto,
  ): Promise<TriggerOtpServiceDto> {
    this.logger.log(this.triggerOtp.name);
    const {
      nationalIdNumber,
      msisdn,
      msisdnCountryCode,
      preferredName,
      deviceId,
      deviceOs,
      deviceToken,
      schoolName,
    } = triggerOtpDto;

    const telcoOperatorCheck: boolean =
      this.configService.get<string>('TELCO-OPERATOR-CHECK') === 'true';

    let telcoOp = 'NO-CHECK';
    let telcoWallet = '';
    let telcoUssd = '';
    const fullMsisdn = msisdnCountryCode + msisdn;
    if (telcoOperatorCheck) {
      let isMatched = false;
      for (const mtnUg of this.MTN_UG) {
        if (fullMsisdn.startsWith(mtnUg)) {
          isMatched = true;
          telcoOp = TelcoOpType.MTN_UG;
          telcoWallet = 'MTN_MOMO';
          telcoUssd = mtnUg;
          break;
        }
      }
      for (const airtelUg of this.AIRTEL_UG) {
        if (fullMsisdn.startsWith(airtelUg)) {
          isMatched = true;
          telcoOp = TelcoOpType.AIRTEL_UG;
          telcoWallet = 'AIRTEL_WALLET';
          telcoUssd = airtelUg;
          break;
        }
      }

      if (!isMatched) {
        return new TriggerOtpServiceDto(
          null,
          null,
          null,
          null,
          null,
          true,
          null,
          null,
          null,
        );
      }
    }

    let updatedLead: ICustOtp = new CustOtp();
    let isOtpExpired: boolean;
    let isWhitelisted = false;
    let whiteListedJSON: any = '';
    let whitelistMsg: any = '';
    let email;
    if (triggerOtpDto.email !== '') {
      email = triggerOtpDto.email;
    }

    const otpType = OtpType.SMS;

    /* dedupe WIP check - Throws Error if MSISDN matches but NIN doesn't (or vice versa) and the lead is already OTP_VERIFIED*/
    // eslint-disable-next-line prefer-const
    let { responseStatus: dedupStatus, custOtp: existingCustOtp } =
      await this.custDedupService.checkWIPDedup(
        nationalIdNumber,
        msisdnCountryCode,
        msisdn,
        email,
      );
    /* end dedupe WIP check*/
    this.logger.log('Dedup response logs');
    this.logger.log(dedupStatus);

    // let telcoResponse: ICustTelco = null;
    switch (dedupStatus) {
      case DedupStatus.DEDUP_NO_MATCH:
        const createdLead = await this.createNewLead(
          nationalIdNumber,
          msisdnCountryCode,
          msisdn,
          email,
          preferredName,
          otpType,
        );

        // const custTelco: ICustTelco =
        //   await this.custTelcoRepo.findByFullMsisdnAndLeadId(
        //     msisdnCountryCode,
        //     msisdn,
        //     createdLead.leadId,
        //   );
        // if (telcoOperatorCheck && telcoOp === TelcoOpType.MTN_UG) {
        //   if (!custTelco) {
        //     telcoResponse = await this.custToLMSService.getTelcoData(
        //       msisdnCountryCode,
        //       msisdn,
        //     );
        //     if (!telcoResponse) {
        //       createdLead.isTerminated = true;
        //       createdLead.terminationReason =
        //         'Registration details not available from MTN MoMo.';
        //       this.custOtpRepository.update(createdLead);
        //       return new TriggerOtpServiceDto(
        //         null,
        //         null,
        //         null,
        //         null,
        //         null,
        //         null,
        //         true,
        //       );
        //     }
        //   }
        // }

        //getSchoolpayWhiteListingV2 calls Actual / Actual & Mock Server depending on IS_MOCK_SCHOOLPAY_WHITELISTING

        this.logger.log('School name :: ' + schoolName);
        this.logger.log(
          'SCHOOL_WHITELISTING_CHECK :: ' + this.SCHOOL_WHITELISTING_CHECK,
        );

        let isWhitelistedSchoolFound = false;
        if (this.SCHOOL_WHITELISTING_CHECK) {
          const whitelistedSchool: IWhitelistedSchool =
            await this.whitelistedSchoolRepo.findByName(schoolName);
          isWhitelistedSchoolFound = whitelistedSchool ? true : false;
        }

        this.logger.log(
          'isWhitelistedSchoolFound :: ' + isWhitelistedSchoolFound,
        );

        const spResponse =
          await this.whitelistingService.getSchoolpayWhiteListingV2(
            msisdnCountryCode,
            msisdn,
            isWhitelistedSchoolFound,
          );

        this.logger.log('School pay response in Trigger OTP ');
        this.logger.log(spResponse);

        let {
          schoolPayWhitelistResponse,
        }: {
          schoolPayWhitelistResponse:
            | SchoolPayWhitelistResponse
            | WhitelistedDTO;
        } = spResponse;

        const { serverType, whitelistRequestReference } = spResponse;

        const pegPaywhitelistResponse: WhitelistedDTO =
          await this.whitelistingService.getPegpayWhiteListing(
            msisdnCountryCode,
            msisdn,
          );

        ({ isWhitelisted, whitelistMsg, whiteListedJSON } =
          this.whitelistingService.checkWhitelistResponse(
            schoolPayWhitelistResponse,
            pegPaywhitelistResponse,
          ));

        createdLead.whitelisted = isWhitelisted ? 'Y' : 'N';
        if (isWhitelisted) {
          createdLead.whitelistCriteria = isWhitelistedSchoolFound
            ? schoolName
            : 'MSISDN-Whitelisted';
        }
        createdLead.whitelistedJSON = whiteListedJSON;
        createdLead.telcoOp = telcoOp;
        createdLead.telcoWallet = telcoWallet;
        createdLead.telcoUssdCode = telcoUssd;

        updatedLead = await this.custOtpRepository.update(createdLead);

        //Stop onboarding if customer is not whitelisted
        if (!isWhitelisted) {
          return new TriggerOtpServiceDto(
            updatedLead,
            dedupStatus,
            isOtpExpired,
            whitelistMsg,
            whiteListedJSON,
            false,
            null,
            null,
            null,
          );
        }

        //Save into Whitelisted Student Details DB
        schoolPayWhitelistResponse =
          await this.whitelistingService.parseAndSaveAnySchoolPayResponse(
            serverType,
            schoolPayWhitelistResponse,
            updatedLead,
            whitelistRequestReference,
          );

        await this.whitelistingService.parseAndSavePegpayResponse(
          pegPaywhitelistResponse,
          updatedLead,
        );

        //MTN Opt In Flow for MTN Prefix Numbers (Telco Op Check must also be True)
        if (telcoOp == TelcoOpType.MTN_UG) {
          const { approvalid } = await this.mtnService.optIn(
            msisdnCountryCode,
            msisdn,
          );
          //Return approvalId so controller will return the 3994 statusCode (Mtn Opt In Triggered)
          return new TriggerOtpServiceDto(
            updatedLead,
            dedupStatus,
            null,
            null,
            null,
            false,
            null,
            approvalid,
            null,
          );
        } else {
          //If non-MTN number or Telco Op Check is false then just send SMS
          updatedLead = await this.sendAndSaveOtp(updatedLead);
          //Register Device for push notifications
          if (deviceId && deviceToken && deviceOs) {
            const userDevice =
              await this.pushNotificationService.registerDeviceForPushNotifications(
                {
                  deviceId,
                  deviceOs,
                  firebaseToken: deviceToken,
                  leadId: updatedLead.leadId,
                },
              );
            //   /*
            // userDevice will be null if there were no changes to userDevice properties
            // and platform app endpoint exists
            // */
            this.logger.log(userDevice);
            if (userDevice) {
              await this.pushNotificationService.unenrolAllTopics(userDevice);
              await this.pushNotificationService.enrolTopic(userDevice); //general push topic is subscribed if no TopicARN is provided
            }
          } else {
            this.logger.log(
              'Trigger OTP service Dedupe NO MATCH: Device info is not present',
            );
          }
        }
        break;
      case DedupStatus.WIP:
        //lead not onboarded yet

        if (existingCustOtp.whitelistedJSON)
          whiteListedJSON = JSON.parse(existingCustOtp.whitelistedJSON);

        //If whitelisted is null | undefined, then no whitelisted student details have been saved yet
        if (
          existingCustOtp.whitelisted == null ||
          existingCustOtp.whitelisted == undefined
        ) {
          let isWhitelistedSchoolFound = false;
          if (this.SCHOOL_WHITELISTING_CHECK) {
            const whitelistedSchool: IWhitelistedSchool =
              await this.whitelistedSchoolRepo.findByName(schoolName);
            isWhitelistedSchoolFound = whitelistedSchool ? true : false;
          }

          const spResponse =
            await this.whitelistingService.getSchoolpayWhiteListingV2(
              msisdnCountryCode,
              msisdn,
              isWhitelistedSchoolFound,
            );

          let {
            schoolPayWhitelistResponse,
          }: {
            schoolPayWhitelistResponse:
              | SchoolPayWhitelistResponse
              | WhitelistedDTO;
          } = spResponse;

          const { serverType, whitelistRequestReference } = spResponse;

          //Save into Whitelisted Student Details DB
          schoolPayWhitelistResponse =
            await this.whitelistingService.parseAndSaveAnySchoolPayResponse(
              serverType,
              schoolPayWhitelistResponse,
              updatedLead,
              whitelistRequestReference,
            );

          const pegPaywhitelistResponse: WhitelistedDTO =
            await this.whitelistingService.getPegpayWhiteListing(
              msisdnCountryCode,
              msisdn,
            );

          ({ isWhitelisted, whitelistMsg, whiteListedJSON } =
            this.whitelistingService.checkWhitelistResponse(
              schoolPayWhitelistResponse,
              pegPaywhitelistResponse,
            ));

          existingCustOtp.whitelisted = isWhitelisted ? 'Y' : 'N';
          if (isWhitelisted) {
            existingCustOtp.whitelistCriteria = isWhitelistedSchoolFound
              ? schoolName
              : 'MSISDN-Whitelisted';
          }
          existingCustOtp.whitelistedJSON = whiteListedJSON;
          await this.custOtpRepository.update(existingCustOtp);
        }
        if (existingCustOtp.whitelisted === 'N') {
          whitelistMsg = ResponseMessage.WHITE_LISTED_ERROR;
        } else {
          if (existingCustOtp.leadCurrentStatus !== LeadStatus.LEAD_ONBOARDED) {
            isOtpExpired = this.checkIsOtpExpired(existingCustOtp.otpExpiry); //isOtpExpired no longer used FUR-1128
            const { isOtpLocked, custOtp } = await this.checkIsOtpLocked(
              existingCustOtp,
            );
            existingCustOtp = custOtp; //update existingCustOtp object

            if (
              existingCustOtp?.telcoOp == TelcoOpType.MTN_UG &&
              (!existingCustOtp?.mtnApprovalId ||
                !existingCustOtp?.mtnValidationStatus)
            ) {
              //send mtn opt in
              const { approvalid } = await this.mtnService.optIn(
                msisdnCountryCode,
                msisdn,
              );

              //Return responseStatus MTN_OPT_IN_TRIGGERED so controller will return the correct response
              return new TriggerOtpServiceDto(
                existingCustOtp,
                dedupStatus,
                null,
                whitelistMsg,
                whiteListedJSON,
                false,
                null,
                approvalid,
                null,
              );
            }

            if (
              existingCustOtp?.telcoOp == TelcoOpType.MTN_UG &&
              existingCustOtp?.mtnValidationStatus !== 'VALIDATION_SUCCESS' &&
              //Edge Case: Prevent accidental termination of lead if validation status is updated, only terminate if OTP_NOT_SENT
              existingCustOtp.leadCurrentStatus == LeadStatus.OTP_NOT_SENT
            ) {
              //TERMINATE LEAD
              existingCustOtp.isTerminated = true;
              existingCustOtp.terminationReason =
                'MTN Opt-In Validation Status is not VALIDATION_SUCCESS';
              await this.custOtpRepository.update(existingCustOtp);
              return new TriggerOtpServiceDto(
                null,
                null,
                null,
                null,
                null,
                null,
                true,
                null,
                true, //isOnboardingTerminated
              );
            }

            //Below will run if MTN Opt-In flow is successful OR Non MTN Number
            if (isOtpLocked) {
              const timeToUnlockMinutes = getTimeToUnlockMinutes(
                existingCustOtp.lockedAt || existingCustOtp.otpSentLockedAt,
                this.OTP_LOCKED_COOLOFF_SECONDS,
              );
              throw new OtpLockedError(
                ErrorMessage.OTP_LOCK,
                timeToUnlockMinutes,
              );
            } else {
              //Otherwise send otp
              updatedLead = await this.sendAndSaveOtp({
                ...existingCustOtp,
                otpType,
              });
              this.logger.log(updatedLead);

              if (deviceId && deviceToken && deviceOs) {
                //Register Device for push notifications
                const userDevice =
                  await this.pushNotificationService.registerDeviceForPushNotifications(
                    {
                      deviceId,
                      deviceOs,
                      firebaseToken: deviceToken,
                      leadId: updatedLead.leadId,
                    },
                  );
                // /*
                // userDevice will be null if there were no changes to userDevice properties
                // and platform app endpoint exists
                // */
                if (userDevice) {
                  await this.pushNotificationService.unenrolAllTopics(
                    userDevice,
                  );
                  await this.pushNotificationService.enrolTopic(userDevice); //general push topic is subscribed if no TopicARN is provided
                }
              } else {
                this.logger.log(
                  'Trigger otp before Dedup WIP found: Device info not present',
                );
              }
            }
          } else {
            //OTP not sent because LEAD_ONBOARDED, return exisitng custOtp (lead)
            updatedLead = {
              ...existingCustOtp,
              //set values to undefined so that presenter does not display them
              phoneStatus: undefined,
              emailStatus: undefined,
              otpType: undefined,
              otp: undefined,
            };
          }
        }

        break;
      case DedupStatus.DEDUP_MATCH:
        break;

      case DedupStatus.DEDUP_MATCH_OPTOUT_OR_CLOSED:
        this.logger.log('Dedup status:  DEDUP_MATCH_OPTOUT_OR_CLOSED');
        break;
      default:
        this.logger.error('error triggering OTP');
        throw new Error('error triggering otp');
        break;
    }

    return new TriggerOtpServiceDto(
      updatedLead,
      dedupStatus,
      isOtpExpired,
      whitelistMsg,
      whiteListedJSON,
      false,
      null,
      null,
      null,
    );
  }

  private async sendAndSaveOtp(custOtp: ICustOtp) {
    this.logger.log(this.sendAndSaveOtp.name);
    const { otpType, msisdnCountryCode, msisdn, email } = custOtp;
    custOtp.phoneStatus = false;
    custOtp.emailStatus = false;

    // generate OTP and expiry
    const isHardcodedOtp: boolean =
      this.configService.get<string>('IS_HARDCODED_OTP') === 'true';
    const otp = generateOTP(isHardcodedOtp);
    custOtp.otp = otp;
    const otpCreatedTime = new Date(Date.now());
    custOtp.otpCreatedAt = otpCreatedTime;
    if (
      custOtp.leadCurrentStatus === LeadStatus.OTP_NOT_SENT ||
      custOtp.leadCurrentStatus === LeadStatus.OTP_GENERATED ||
      custOtp.leadCurrentStatus === LeadStatus.OTP_FAILED
    ) {
      custOtp.leadCurrentStatus = LeadStatus.OTP_GENERATED;
    }
    const otpValidSeconds = this.configService.get<number>('OTP_VALID_SECONDS');
    custOtp.otpExpiry = new Date(
      otpCreatedTime.getTime() + otpValidSeconds * 1000,
    );

    // send SMS
    if (otpType === OtpType.SMS || otpType === OtpType.BOTH) {
      try {
        await this.notificationService.sendOTPSms(
          custOtp.preferredName,
          otp,
          otpType,
          msisdnCountryCode,
          msisdn,
        );
        custOtp.phoneStatus = true;
      } catch (err) {
        this.logger.error('error sending SMS');
        custOtp.phoneStatus = false;
        throw err;
      }
    }

    //send email
    if (otpType === OtpType.EMAIL || otpType === OtpType.BOTH) {
      try {
        this.notificationService.sendOTPEmail(otp, otpType, email);
        custOtp.emailStatus = true;
      } catch (err) {
        this.logger.error('error sending Email');
        custOtp.emailStatus = false;
        throw err;
      }
    }

    if (custOtp.phoneStatus || custOtp.emailStatus) {
      custOtp.otpSentAt = new Date(Date.now());
      custOtp.otpSentCount += 1;
    }
    if (custOtp.otpSentCount >= this.REGISTER_OTP_MAX_RETRIES) {
      custOtp.otpSentLockedAt = new Date();
    }
    return this.custOtpRepository.update(custOtp);
  }

  private createNewLead(
    nationalIdNumber,
    msisdnCountryCode,
    msisdn,
    email,
    preferredName,
    otpType,
  ): Promise<ICustOtp> {
    this.logger.log(this.createNewLead.name);
    const newCustOtp = new CustOtp();
    newCustOtp.nationalIdNumber = nationalIdNumber;
    newCustOtp.msisdnCountryCode = msisdnCountryCode;
    newCustOtp.msisdn = msisdn;
    newCustOtp.email = email;
    newCustOtp.leadCurrentStatus = LeadStatus.OTP_NOT_SENT;
    newCustOtp.failedAttempts = 0;
    newCustOtp.otpSentCount = 0;
    newCustOtp.otpType = otpType;
    newCustOtp.preferredName = preferredName;

    return this.custOtpRepository.create(newCustOtp);
  }

  private checkIsOtpExpired(expiryDate: Date): boolean {
    if (expiryDate) {
      return Date.now() > expiryDate.getTime();
    }
    // if expiry date is null, OTP is considered expired
    return true;
  }

  private async checkIsOtpLocked(custOtp: ICustOtp) {
    let isOtpLocked = false;
    const { lockedAt, otpSentLockedAt } = custOtp;
    if (otpSentLockedAt) {
      if (
        //Still within cooloff period
        Date.now() <
        otpSentLockedAt.getTime() + this.OTP_LOCKED_COOLOFF_SECONDS * 1000
      ) {
        isOtpLocked = true;
      } else {
        custOtp = await this.custOtpRepository.update({
          ...custOtp,
          otpSentCount: 0,
          otpSentLockedAt: null,
        });
      }
    }
    if (lockedAt) {
      if (
        //Still within cooloff period
        Date.now() <
        lockedAt.getTime() + this.OTP_LOCKED_COOLOFF_SECONDS * 1000
      ) {
        isOtpLocked = true;
      } else {
        custOtp = await this.custOtpRepository.update({
          ...custOtp,
          failedAttempts: 0,
          lockedAt: null,
        });
      }
    }
    return { isOtpLocked, custOtp };
  }

  async generateWhitelistedStudentDetailsEntitiy(
    leadId: string,
    whitelistStudentDTO: WhiteListedStudentDetailsDTO,
    aggregatorId: string,
  ): Promise<WhitelistedStudentDetails> {
    const entity: IWhitelistedStudentDetails = new WhitelistedStudentDetails();
    entity.leadId = leadId;
    entity.aggregatorId = aggregatorId;
    entity.studentFullName = whitelistStudentDTO.studentName;
    entity.studentSchoolCode = whitelistStudentDTO.schoolCode;
    entity.schoolName = whitelistStudentDTO.schoolName;
    entity.studentSchoolRegnNumber = whitelistStudentDTO.studentRegnNumber;
    entity.studentGender =
      whitelistStudentDTO.studentGender === 'MALE'
        ? Gender.MALE
        : Gender.FEMALE;
    entity.studentClass = whitelistStudentDTO.studentClass;
    entity.termsAcademicYear = whitelistStudentDTO.term_year;
    entity.term1Fee = whitelistStudentDTO.term_1_fee;
    entity.term2Fee = whitelistStudentDTO.term_2_fee;
    entity.term3Fee = whitelistStudentDTO.term_3_fee;
    entity.totalTermsFee =
      whitelistStudentDTO.term_1_fee +
      whitelistStudentDTO.term_2_fee +
      whitelistStudentDTO.term_3_fee;
    entity.currentStatus = WhitelistStatus.WHITELISTING;
    entity.isStudentDeleted = false;
    entity.isCustomerConfirmed = false;
    entity.isLOSDeleted = false;
    entity.isLOSUpdated = false;
    return entity;
  }
}
