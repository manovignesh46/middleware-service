import { randomUUID } from 'crypto';
import { ClientStatus } from '../../domain/enum/clientStatus.enum';
import { ClientType } from '../../domain/enum/clientType.enum';
import { Gender } from '../../domain/enum/gender.enum';
import { IdCardStatus } from '../../domain/enum/id-card-status.enum';
import { IdType } from '../../domain/enum/id-type.enum';
import { MatchStatus } from '../../domain/enum/matchStatus.enum';
import { TicketType } from '../../domain/enum/ticketType.enum';
import { ICustFsRegistration } from '../../domain/model/custFsRegistration.interface';
import { ICustPrimaryDetails } from '../../domain/model/custPrimaryDetails.interface';
import { ICustRefinitiv } from '../../domain/model/custRefinitiv.interface';
import { ICustTelco } from '../../domain/model/custTelco.interface';
import { ICustTelcoTransaction } from '../../domain/model/custTelcoTransaction.interface';
import { ICustTicketDetails } from '../../domain/model/custTicketDetails.interface';
import { IWhitelistedSchool } from '../../domain/model/whitelistedSchool.interface';
import { SubmitTicketDTO } from '../controllers/customers/dtos/submitTicket.dto';
import { TelcoTransactionResp } from '../controllers/customers/dtos/telcoTransactionResp.dto';

export class MockData {
  public static mockLMSRespomse = {
    data: {
      msisdn: '5432166669',
      product_type: 'Installment',
      total_loans: 1,
      active_loans: 1,
      closed_loans: [],
      total_loan_amount: 5295.0,
      total_payable_amount: 0.0,
      open_loans: [
        {
          id: 30,
          interest_rate: '0.12',
          emi_amount: 415.96,
          next_financial_milestone_at: '2023-05-23T08:51:15.571Z',
          loan_amount: 5295.0,
          loan_date: '2023-05-23',
          loan_due_date: '2023-08-22',
          is_loan_overdue: true,
          overdue_message:
            'Please pay as soon as possible or you will be reported to bureau.',
          due_day: '2nd',
          emi_due_count: 0,
          emi_paid_count: 2,
          total_emi_amount_due: 0.0,
          total_outstanding: 4812.37,
          amount_paid: 5600.0,
          total_payable: 5455.55,
          loan_against_id: '646c68641e92591123803456',
          variant_id: 1684482484387,
          product_name: 'School Fee Loan',
          loan_against_details: null,
        },
      ],
      customer_id: 397,
      available_credit_limit: 0,
      credit_score: 0,
      eligible_variants: [
        {
          product_variant_id: 1685014421007,
          product_variant_name: 'SFL 90 days weekly',
          product_variant_type: 'Installment',
          product_variant_limit: 5000000.0,
          product_variant_status: 'Active',
          rate_of_interest: 0.12,
          tenure: 90,
          repayment_frequency: 'weekly',
          no_of_installment: 12,
          application_fee_json: {
            application_fee: 5.0,
            application_fee_taxable: false,
            application_fee_type: 'percentage',
            application_fee_min_amount: 10000.0,
            application_fee_amx_amount: 100000.0,
            application_fee_tax_applicable: false,
            application_fee_short_disbursal: true,
            application_fee_tax_mode: null,
          },
        },
      ],
      total_credit_limit: 5000000,
    },
    status: 'success',
    code: 2000,
    message: 'ok',
  };

  public static mockRefinitiveResponseNew = {
    caseId: '5jb6sz38w82q1hsakm137l3lj',
    name: 'John Doe',
    providerTypes: ['WATCHLIST'],
    customFields: [],
    secondaryFields: [
      {
        typeId: 'SFCT_3',
        value: 'IND',
        dateTimeValue: null,
      },
      {
        typeId: 'SFCT_2',
        value: null,
        dateTimeValue: '1971-06-08',
      },
      {
        typeId: 'SFCT_1',
        value: 'MALE',
        dateTimeValue: null,
      },
    ],
    groupId: '5jb6vls802mr1hj9rtl55pppj',
    entityType: 'INDIVIDUAL',
    caseSystemId: '5jb6sz38w82q1hsakm137l3lk',
    caseScreeningState: {
      WATCHLIST: 'ONGOING',
    },
    lifecycleState: 'UNARCHIVED',
    creator: {
      userId: '5jb6vls802mr1hj9rvs2e7wsf',
      firstName: 'Furaha',
      lastName: 'Refinitiv',
      fullName: 'Furaha Refinitiv',
      email: 'RefinitivAdmin@furaha.financial',
      status: 'ACTIVE',
    },
    modifier: {
      userId: '5jb6vls802mr1hj9rvs2e7wsf',
      firstName: 'Furaha',
      lastName: 'Refinitiv',
      fullName: 'Furaha Refinitiv',
      email: 'RefinitivAdmin@furaha.financial',
      status: 'ACTIVE',
    },
    assignee: null,
    creationDate: '2023-06-27T09:54:12.580Z',
    modificationDate: '2023-06-27T09:54:15.037Z',
    nameTransposition: false,
    outstandingActions: false,
    lastScreenedDatesByProviderType: {
      WATCHLIST: '2023-06-27T09:54:15.037Z',
    },
    results: [],
  };

  public static mockRefinitiveResponse = {
    caseId: '5jb6sz38w82q1hsakm137l3lj',
    name: 'John Doe',
    providerTypes: ['WATCHLIST'],
    customFields: [],
    secondaryFields: [
      {
        typeId: 'SFCT_3',
        value: 'IND',
        dateTimeValue: null,
      },
      {
        typeId: 'SFCT_2',
        value: null,
        dateTimeValue: '1971-06-08',
      },
      {
        typeId: 'SFCT_1',
        value: 'MALE',
        dateTimeValue: null,
      },
    ],
    groupId: '5jb6vls802mr1hj9rtl55pppj',
    entityType: 'INDIVIDUAL',
    caseSystemId: '5jb6sz38w82q1hsakm137l3lk',
    caseScreeningState: {
      WATCHLIST: 'ONGOING',
    },
    lifecycleState: 'UNARCHIVED',
    creator: {
      userId: '5jb6vls802mr1hj9rvs2e7wsf',
      firstName: 'Furaha',
      lastName: 'Refinitiv',
      fullName: 'Furaha Refinitiv',
      email: 'RefinitivAdmin@furaha.financial',
      status: 'ACTIVE',
    },
    modifier: {
      userId: '5jb6vls802mr1hj9rvs2e7wsf',
      firstName: 'Furaha',
      lastName: 'Refinitiv',
      fullName: 'Furaha Refinitiv',
      email: 'RefinitivAdmin@furaha.financial',
      status: 'ACTIVE',
    },
    assignee: null,
    creationDate: '2023-06-27T09:54:12.580Z',
    modificationDate: '2023-06-27T09:54:15.037Z',
    nameTransposition: false,
    outstandingActions: false,
    lastScreenedDatesByProviderType: {
      WATCHLIST: '2023-06-27T09:54:15.037Z',
    },
    results: [
      {
        resultId: '5jb82wj5a7dy1hsakm70q9703',
        referenceId: 'e_tr_wci_3901889',
        matchScore: 88.0,
        matchStrength: 'MEDIUM',
        matchedTerm: 'John Doesnt',
        matchedTerms: [
          {
            term: 'John Doesnt',
            type: 'PRIMARY',
          },
        ],
        submittedTerm: 'John Doe',
        matchedNameType: 'PRIMARY',
        secondaryFieldResults: [
          {
            field: {
              typeId: 'SFCT_3',
              value: 'IND',
              dateTimeValue: null,
            },
            typeId: 'SFCT_3',
            submittedValue: 'IND',
            submittedDateTimeValue: null,
            matchedValue: 'IND',
            matchedDateTimeValue: null,
            fieldResult: 'MATCHED',
          },
          {
            field: {
              typeId: 'SFCT_2',
              value: null,
              dateTimeValue: '1977-05-14',
            },
            typeId: 'SFCT_2',
            submittedValue: null,
            submittedDateTimeValue: '1971-06-08',
            matchedValue: null,
            matchedDateTimeValue: '1977-05-14',
            fieldResult: 'NOT_MATCHED',
          },
          {
            field: {
              typeId: 'SFCT_1',
              value: 'MALE',
              dateTimeValue: null,
            },
            typeId: 'SFCT_1',
            submittedValue: 'MALE',
            submittedDateTimeValue: null,
            matchedValue: 'MALE',
            matchedDateTimeValue: null,
            fieldResult: 'MATCHED',
          },
        ],
        sources: ['b_trwc_M:1UQ', 'b_trwc_INMCA-DD2'],
        categories: ['Special Interest Categories', 'Regulatory Enforcement'],
        creationDate: '2023-06-27T09:54:15.038Z',
        modificationDate: '2023-06-27T09:54:15.038Z',
        resolution: {
          statusId: '5jb6vls802mr1hj9rtwzce1lw',
          riskId: null,
          reasonId: null,
          resolutionRemark: null,
          resolutionDate: null,
        },
        resultReview: {
          reviewRequired: false,
          reviewRequiredDate: '2022-08-01T00:00:00.000Z',
          reviewRemark: null,
          reviewDate: null,
        },
        primaryName: 'John Doesnt',
        events: [
          {
            address: null,
            allegedAddresses: [],
            day: 14,
            fullDate: '1977-05-14',
            month: 5,
            type: 'BIRTH',
            year: 1977,
          },
        ],
        countryLinks: [
          {
            country: {
              code: 'IND',
              name: 'INDIA',
            },
            countryText: 'INDIA',
            type: 'LOCATION',
          },
          {
            country: {
              code: 'IND',
              name: 'INDIA',
            },
            countryText: 'INDIA',
            type: 'NATIONALITY',
          },
        ],
        identityDocuments: [
          {
            entity: null,
            expiryDate: null,
            issueDate: null,
            issuer: null,
            locationType: {
              country: {
                code: 'IND',
                name: 'INDIA',
              },
              name: 'DIRECTORS IDENTIFICATION NUMBER',
              type: 'IN-DIN',
            },
            number: '3322262',
            type: 'DIN',
          },
        ],
        category: 'INDIVIDUAL',
        providerType: 'WATCHLIST',
        gender: 'MALE',
        entityCreationDate: '2018-03-16T00:00:00.000Z',
        entityModificationDate: '2022-08-01T00:00:00.000Z',
        actionTypes: [],
      },
    ],
  };

  public static mockTelcoTransactionData: TelcoTransactionResp = {
    id: 5,
    countrycode: 65,
    msisdn: 2222211110,
    wallet_risk_score: 510,
    loan_risk_score: 520,
    churn_decile: 5,
    spend_quartile: 5,
    of_last_30d: 530,
  };

  public static mockRefinitiveEnityData: ICustRefinitiv = {
    createdAt: new Date(Date.parse('2023-04-08T20:29:40.521Z')),
    updatedAt: new Date(Date.parse('2023-04-08T20:29:40.521Z')),
    id: '12345',
    idType: 'LEAD',
    idValue: '123',
    caseId: 'asdad',
    caseSystemId: '',
    lastScreenedDatesByProviderType: '',
    resultsCount: 0,
    resultIdReferenceId: '',
    recieveedResponse: '',
    sanctionStatus: MatchStatus.MATCHED,
    matchedResultElement: '',
    isDataSentToLOS: false,
    isActive: false,
    resolutionDone: '',
    resolutionSentDate: undefined,
    resolutionStatus: '',
  };

  public static mockCustTelcoEnitytData: ICustTelco = {
    createdAt: new Date(Date.parse('2023-08-16T19:25:01.257Z')),
    updatedAt: new Date(Date.parse('2023-08-16T19:25:01.257Z')),
    id: '5d503f51-d8b2-4975-aab6-32e400ead147',
    idType: IdType.LEAD,
    idValue: '12345',
    telcoId: '1',
    firstName: 'Darshan',
    lastName: null,
    givenName: 'Vadyar',
    middleName: null,
    gender: Gender.MALE,
    isBarred: null,
    registrationType: null,
    msisdn: '1234567890',
    msisdnCountryCode: '+256',
    nationalIdNumber: 'AB1234567890XY',
    ninComparison: MatchStatus.MATCHED,
    dob: '01/08/1997',
    registrationDate: '01/12/2022',
    nationality: 'UG',
    isDataSentToLOS: false,
    idExpiry: new Date('9999-12-30'),
  };

  public static mockCustTelcoTransactionEntityData: ICustTelcoTransaction = {
    createdAt: new Date(Date.parse('2023-08-16T19:25:01.257Z')),
    updatedAt: new Date(Date.parse('2023-08-16T19:25:01.257Z')),
    id: '030382af-f718-490b-92bb-0f38a0310e52',
    idType: IdType.LEAD,
    idValue: '12345',
    telcoId: '1',
    transactionData:
      '{"id":1,"countrycode":256,"msisdn":1234567890,"wallet_risk_score":110,"loan_risk_score":120,"churn_decile ":1,"spend_quartile":1,"of_last_30d":130,"30d_of":140}',
    isDataSentToLOS: true,
    isActive: true,
  };

  public static mockCustFSRegistration: ICustFsRegistration = {
    createdAt: new Date(Date.parse('2023-11-15T21:20:38.328Z')),
    updatedAt: new Date(Date.parse('2023-11-15T21:20:38.328Z')),
    custId: '8d61c64b-fbef-4b9f-969c-4a76e220f16c',
    custCountryCode: '+256',
    custMsisdn: '201139661',
    primaryEmail: 'rudra@gmail.com',
    fsIsActive: true,
    fsRequesterId: 130000082850,
  };

  public static mockCustRefinitiveEntityData: ICustRefinitiv = {
    createdAt: new Date(Date.parse('2023-08-16T19:25:01.257Z')),
    updatedAt: new Date(Date.parse('2023-08-16T19:25:01.257Z')),
    id: '504de6aa-5bcc-4ce8-9dc1-0a89a1907798',
    idType: 'LEAD',
    idValue: '5ecd027a-8db0-44a7-8476-9f850c8df305',
    caseId: '5jb6sz38w82q1hsakm137l3lj',
    caseSystemId: '5jb6sz38w82q1hsakm137l3lk',
    lastScreenedDatesByProviderType: '{"WATCHLIST":"2023-06-27T09:54:15.037Z"}',
    resultsCount: 1,
    resultIdReferenceId:
      '[{"resultId":"5jb82wj5a7dy1hsakm70q9703","referenceId":"e_tr_wci_3901889"}]',
    recieveedResponse:
      '{"caseId":"5jb6sz38w82q1hsakm137l3lj","name":"John Doe","providerTypes":["WATCHLIST"],"customFields":[],"secondaryFields":[{"typeId":"SFCT_3","value":"IND","dateTimeValue":null},{"typeId":"SFCT_2","value":null,"dateTimeValue":"1971-06-08"},{"typeId":"SFCT_1","value":"MALE","dateTimeValue":null}],"groupId":"5jb6vls802mr1hj9rtl55pppj","entityType":"INDIVIDUAL","caseSystemId":"5jb6sz38w82q1hsakm137l3lk","caseScreeningState":{"WATCHLIST":"ONGOING"},"lifecycleState":"UNARCHIVED","creator":{"userId":"5jb6vls802mr1hj9rvs2e7wsf","firstName":"Furaha","lastName":"Refinitiv","fullName":"Furaha Refinitiv","email":"RefinitivAdmin@furaha.financial","status":"ACTIVE"},"modifier":{"userId":"5jb6vls802mr1hj9rvs2e7wsf","firstName":"Furaha","lastName":"Refinitiv","fullName":"Furaha Refinitiv","email":"RefinitivAdmin@furaha.financial","status":"ACTIVE"},"assignee":null,"creationDate":"2023-06-27T09:54:12.580Z","modificationDate":"2023-06-27T09:54:15.037Z","nameTransposition":false,"outstandingActions":false,"lastScreenedDatesByProviderType":{"WATCHLIST":"2023-06-27T09:54:15.037Z"},"results":[{"resultId":"5jb82wj5a7dy1hsakm70q9703","referenceId":"e_tr_wci_3901889","matchScore":88,"matchStrength":"MEDIUM","matchedTerm":"John Doesnt","matchedTerms":[{"term":"John Doesnt","type":"PRIMARY"}],"submittedTerm":"John Doe","matchedNameType":"PRIMARY","secondaryFieldResults":[{"field":{"typeId":"SFCT_3","value":"IND","dateTimeValue":null},"typeId":"SFCT_3","submittedValue":"IND","submittedDateTimeValue":null,"matchedValue":"IND","matchedDateTimeValue":null,"fieldResult":"MATCHED"},{"field":{"typeId":"SFCT_2","value":null,"dateTimeValue":"1977-05-14"},"typeId":"SFCT_2","submittedValue":null,"submittedDateTimeValue":"1971-06-08","matchedValue":null,"matchedDateTimeValue":"1977-05-14","fieldResult":"NOT_MATCHED"},{"field":{"typeId":"SFCT_1","value":"MALE","dateTimeValue":null},"typeId":"SFCT_1","submittedValue":"MALE","submittedDateTimeValue":null,"matchedValue":"MALE","matchedDateTimeValue":null,"fieldResult":"MATCHED"}],"sources":["b_trwc_M:1UQ","b_trwc_INMCA-DD2"],"categories":["Special Interest Categories","Regulatory Enforcement"],"creationDate":"2023-06-27T09:54:15.038Z","modificationDate":"2023-06-27T09:54:15.038Z","resolution":{"statusId":"5jb6vls802mr1hj9rtwzce1lw","riskId":null,"reasonId":null,"resolutionRemark":null,"resolutionDate":null},"resultReview":{"reviewRequired":false,"reviewRequiredDate":"2022-08-01T00:00:00.000Z","reviewRemark":null,"reviewDate":null},"primaryName":"John Doesnt","events":[{"address":null,"allegedAddresses":[],"day":14,"fullDate":"1977-05-14","month":5,"type":"BIRTH","year":1977}],"countryLinks":[{"country":{"code":"IND","name":"INDIA"},"countryText":"INDIA","type":"LOCATION"},{"country":{"code":"IND","name":"INDIA"},"countryText":"INDIA","type":"NATIONALITY"}],"identityDocuments":[{"entity":null,"expiryDate":null,"issueDate":null,"issuer":null,"locationType":{"country":{"code":"IND","name":"INDIA"},"name":"DIRECTORS IDENTIFICATION NUMBER","type":"IN-DIN"},"number":"3322262","type":"DIN"}],"category":"INDIVIDUAL","providerType":"WATCHLIST","gender":"MALE","entityCreationDate":"2018-03-16T00:00:00.000Z","entityModificationDate":"2022-08-01T00:00:00.000Z","actionTypes":[]}]}',
    matchedResultElement: '[]',
    isDataSentToLOS: false,
    isActive: true,
    sanctionStatus: MatchStatus.NOT_MATCHED,
    resolutionDone: '',
    resolutionSentDate: undefined,
    resolutionStatus: '',
  };

  public static mockCustTicketDetailsEntity: ICustTicketDetails = {
    createdAt: new Date(Date.parse('2023-11-15T21:51:49.628Z')),
    updatedAt: new Date(Date.parse('2023-11-15T21:51:49.628Z')),
    submittedId: '97d86f34-ec51-4ae2-8d6d-87aa9dea49c2',
    custId: '8d61c64b-fbef-4b9f-969c-4a76e220f16c',
    custCountryCode: '+256',
    custMsisdn: '201139661',
    tktType: TicketType.INC,
    tktSubject: 'Support Needed...',
    tktDescription: 'facing issue with app',
    tktCategory: 'Inquiry',
    tktSubCategory: 'Loan Application',
    hasAttachments: false,
    attachmentsCount: 0,
    attachmentsFilenames: '',
    isSentToFs: true,
    sentToFsAt: new Date(Date.parse('2023-11-15T21:51:49.628Z')),
    respHttpStatusCode: 0,
    respErrorBody: '',
    ticketId: 52,
    tktAttachmentsDetails: '',
    tktStatus: '2',
    tktCreatedAt: new Date(Date.parse('2023-11-15T16:21:49.000Z')),
    tktUpdatedAt: new Date(Date.parse('2023-11-15T16:21:49.000Z')),
    tktRequesterId: 130000082850,
    tktRequestedForId: 130000082850,
  };

  public static mockSubmitFSTicketDTO: SubmitTicketDTO = {
    subject: 'Support Needed...',
    category: 'Inquiry',
    subCategory: 'Loan Application',
    message: 'facing issue with app',
    email: 'rudra@gmail.com',
    fullMsisdn: '7991141715',
    hasAttachments: false,
    attachmentFilenames: [],
  };

  public static mockWhitelistData = {
    id: 1987654321,
    countrycode: 256,
    msisdn: 787654326,
    whitelisted: 'Y',
    student_details: [
      {
        studentName: 'John Does',
        schoolCode: 'KAP2',
        schoolName: 'Katatumba Academy',
        studentRegnNumber: 'KCB140022',
        studentGender: 'MALE',
        studentClass: '7th Grade',
        term_year: '2022',
        term_1_fee: 50000.99,
        term_1_paid: 50000.89,
        term_2_fee: 46000.79,
        term_2_paid: 46000,
        term_3_fee: 34000,
        term_3_paid: 0,
      },
      {
        studentName: 'Janice Does',
        schoolCode: 'Core',
        schoolName: 'Kazo Junior Schoo',
        studentRegnNumber: '197800',
        studentGender: 'MALE',
        studentClass: 'S2 Senior Two',
        term_year: '2022',
        term_1_fee: 50000.99,
        term_1_paid: 50000.89,
        term_2_fee: 46000.79,
        term_2_paid: 46000,
        term_3_fee: 34000,
        term_3_paid: 0,
      },
    ],
    last_payment_amount: '46000.00',
    last_payment_date: '29-12-2021',
  };

  public static mockCustPrimaryDetails: ICustPrimaryDetails = {
    id: '8d61c64b-fbef-4b9f-969c-4a76e220f16c',
    leadId: randomUUID(),
    cognitoId: 'cognitoId123',
    clientType: ClientType.CLIENT,
    clientStatus: ClientStatus.ACTIVE,
    msisdnCountryCode: '+256',
    msisdn: '999999999',
    nationalIdNumber: '999999999',
    email: 'abc@abc.com',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now()),
    surname: null,
    givenName: null,
    nationality: null,
    gender: null,
    dateOfBirth: undefined,
    NINOCR: null,
    cardNumber: null,
    dateOfExpiry: undefined,
    scannedImageFront: null,
    scannedImageBack: null,
    selfieImage: null,
    faceMatchPercentage: null,
    faceMatchStatus: null,
    liveliessCheckPercenatge: null,
    livelinessCheckStatus: null,
    totalLoans: 0,
    creditExpiryTime: undefined,
    preferredName: 'Johnny Bravo',
    idExpiryDays: 0,
    idStatus: IdCardStatus.ACTIVE,
    smsNextHours: 0,
    optOutReason: '',
    optOutFeedback: '',
    optOutDate: undefined,
    availableCreditLimit: 0,
  };

  public static mockCreateFSTicket = {
    ticket: {
      cc_emails: [],
      fwd_emails: [],
      reply_cc_emails: [],
      fr_escalated: false,
      spam: false,
      email_config_id: null,
      group_id: null,
      priority: 1,
      requester_id: 130000082693,
      requested_for_id: 130000082693,
      responder_id: null,
      source: 11,
      status: 2,
      subject: "'hi'",
      to_emails: null,
      department_id: null,
      id: 23,
      type: 'Incident',
      due_by: '2023-11-28T16:35:56Z',
      fr_due_by: '2023-11-20T13:35:56Z',
      is_escalated: false,
      description: "<div>'welcom'</div>",
      description_text: "'welcom'",
      category: 'Inquiry',
      sub_category: 'Loan Application',
      item_category: null,
      custom_fields: {
        major_incident_type: null,
        business_impact: null,
        impacted_locations: null,
        no_of_customers_impacted: null,
      },
      created_at: '2023-11-15T16:35:56Z',
      updated_at: '2023-11-15T16:35:56Z',
      tags: [],
      attachments: [
        {
          id: 130000019523,
          content_type: 'image/png',
          size: 497270,
          name: 'Screenshot_2023-03-29_at_10.07.39_PM.png',
          attachment_url:
            'https://furahafinancial-fs-sandbox.ind-attachments.freshservice.com/data/helpdesk/attachments/production/130000019523/original/Screenshot_2023-03-29_at_10.07.39_PM.png?response-content-type=image/png&Expires=1700152556&Signature=KzPErColvCgaPnlbkqCAFs8s7fAKHX84xQT8JsvJ-SQEauz7mDZP4jajS50veDU4-GYoFgeo1Nl8Bmpq~q8C89LR7H28EkqqoFsBF4X~EwBplbBIrLHZLjqBnhS5njg4SHpjbPJhvTT-Dld3zClKi-na5RnhsYZEpHz-P6IQT1VbpHA6KzM-LNveB00IjjVICt6GyfgsJHeV82lsKsTpS1ONtHgcXmEMnd4uTa8-vW3zkXQdz7E36L0T97MyOK9IP-YUvV4bYqHrRj5MAfePZa0zfUmM71lQn03dHEHcrulEeWC8kPFnHRcyGn8QHB3H-UWL8oUeLPpOdq5~ZZPlpQ__&Key-Pair-Id=APKAIPHBXWY2KT5RCMPQ',
          created_at: '2023-11-15T16:35:54Z',
          updated_at: '2023-11-15T16:35:56Z',
        },
      ],
      workspace_id: 2,
    },
  };

  public static mockFSGetALLTicket = {
    tickets: [
      {
        subject: "'hi'",
        group_id: null,
        department_id: null,
        category: 'Inquiry',
        sub_category: 'Loan Application',
        item_category: null,
        requester_id: 130000082693,
        responder_id: null,
        due_by: '2023-11-28T16:35:56Z',
        fr_escalated: false,
        deleted: false,
        spam: false,
        email_config_id: null,
        fwd_emails: [],
        reply_cc_emails: [],
        cc_emails: [],
        is_escalated: false,
        fr_due_by: '2023-11-20T13:35:56Z',
        id: 23,
        priority: 1,
        status: 2,
        source: 11,
        created_at: '2023-11-15T16:35:56Z',
        updated_at: '2023-11-15T16:35:56Z',
        requested_for_id: 130000082693,
        to_emails: null,
        type: 'Incident',
        description: "<div>'welcom'</div>",
        description_text: "'welcom'",
        custom_fields: {
          major_incident_type: null,
          business_impact: null,
          impacted_locations: null,
          no_of_customers_impacted: null,
        },
        workspace_id: 2,
      },
    ],
  };

  static mockMtnOptInResponse = {
    approvalid: 'MTNapprovalId123',
  };

  static mockSchoolPayWhitelistResponse = {
    lastTransaction: {
      firstName: 'Nassuuna',
      lastName: 'Daphine',
      amount: 30000,
      paymentCode: 1002798183,
      registrationNumber: 'student123',
      middleName: '',
      transactionDate: '2021-02-26 09:57:42',
      schoolName: 'NUMASA SECONDARY SCHOOL',
    },
    studentPaymentsAggregate: [
      {
        firstName: 'Nassuuna',
        lastName: 'Daphine',
        paymentCode: 1002798183,
        countOfPaymentsInLastYear: 6,
        middleName: '',
        sumOfPaymentsInLastYear: 753668376,
      },
    ],
    studentsPaidFor: [
      {
        classCode: '__ARCHIVE__',
        firstName: 'Nassuuna',
        lastName: 'Daphine',
        minimumAcceptableAmount: 0,
        gender: 'F',
        paymentCode: '1002798183',
        registrationNumber: '',
        middleName: '',
        schoolName: 'NUMASA SECONDARY SCHOOL',
        activeFees: 0,
      },
    ],
  };

  public static mockWhitelistedSchool: IWhitelistedSchool = {
    id: '1234',
    countryCode: '+256',
    createdAt: new Date('9999-12-30'),
    district: 'xyz',
    emisCode: 1,
    schoolName: 'schoolName',
    updatedAt: new Date('9999-12-30'),
  };
}
