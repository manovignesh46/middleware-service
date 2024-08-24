import { Injectable, Logger } from '@nestjs/common';
import { ICustRefinitiv } from '../domain/model/custRefinitiv.interface';
import { ICustRefinitivService } from '../domain/services/custRefinitivService.interface';
import { ICustRefinitivRepository } from '../domain/repository/custRefinitivRepository.interface';
import { IRefinitiveService } from '../domain/services/refinitiveService.interface';
import { CustRefinitiv } from '../infrastructure/entities/custRefinitiv.entity';
import {
  RefinitiveResultDTO,
  ResultIdRefIdPair,
} from '../infrastructure/controllers/customers/dtos/refinitiveResult.dto';
import { MatchStatus } from '../domain/enum/matchStatus.enum';
import { RefinitiveToolkitDTO } from '../infrastructure/controllers/customers/dtos/refinitiveToolkit.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustRefinitivService implements ICustRefinitivService {
  private readonly logger = new Logger(CustRefinitivService.name);
  private refinitiveToolkitArr: RefinitiveToolkitDTO[];

  constructor(
    private readonly custRefinitivRepository: ICustRefinitivRepository,
    private readonly refinitiveService: IRefinitiveService,
    private readonly configService: ConfigService,
  ) {
    this.refinitiveToolkitArr = JSON.parse(
      this.configService.get<string>('REFINITIV_TOOL_KIT_STATUS_IDS'),
    );
  }

  async findAndSaveRefinitiveData(
    isLead: boolean,
    idValue: string,
    name: string,
    gender: string,
    dob: string,
    countryName: string,
  ) {
    const response: any = await this.refinitiveService.getRefinitiv(
      name,
      gender,
      dob,
      countryName,
    );

    const custRefinitive: ICustRefinitiv = new CustRefinitiv();

    this.logger.log('Refinitive Response:');
    this.logger.log(response);

    if (!(response == null)) {
      const results: RefinitiveResultDTO[] = response['results'];

      const sancationStatus = await this.findSanctionStatus(results);

      custRefinitive.idType = 'LEAD';
      if (!isLead) custRefinitive.idType = 'CUST';

      custRefinitive.idValue = idValue;
      custRefinitive.caseId = response['caseId'];
      custRefinitive.caseSystemId = response['caseSystemId'];
      custRefinitive.lastScreenedDatesByProviderType =
        response['lastScreenedDatesByProviderType'];

      custRefinitive.resultsCount = results.length;
      custRefinitive.resultIdReferenceId = JSON.stringify(
        sancationStatus['resultIdRefIdPairs'],
      );
      custRefinitive.matchedResultElement = JSON.stringify(
        sancationStatus['matchedResultElement'],
      );
      custRefinitive.recieveedResponse = response;
      custRefinitive.sanctionStatus = sancationStatus['sanctionStatus'];
      custRefinitive.isDataSentToLOS = false;
      custRefinitive.isActive = true;

      this.custRefinitivRepository.save(custRefinitive);

      this.logger.log('Data got stored in Cust Refinitiv table');
    }
  }

  async findSanctionStatus(results: RefinitiveResultDTO[]): Promise<any> {
    let matchedResultElement: any = {};
    const resultIdRefIdPairs: ResultIdRefIdPair[] = [];

    let matchStatus = MatchStatus.NOT_MATCHED;
    if (results.length > 0) {
      for await (const result of results) {
        const resIdRefId = new ResultIdRefIdPair();
        resIdRefId.resultId = result.resultId;
        resIdRefId.referenceId = result.referenceId;
        resultIdRefIdPairs.push(resIdRefId);

        matchedResultElement = result.resolution;
        if (result.resolution && result?.resolution?.statusId) {
          for await (const refinitiveTool of this.refinitiveToolkitArr) {
            if (refinitiveTool.id === result?.resolution?.statusId) {
              if (
                ['POSITIVE', 'POSSIBLE', 'UNSPECIFIED'].includes(
                  refinitiveTool?.type,
                )
              ) {
                matchStatus = MatchStatus.MATCHED;
              }
            }
          }
        } else {
          matchStatus = MatchStatus.MATCHED;
        }

        // if (result.matchedTerm === result.submittedTerm) {
        //   matchStatus = MatchStatus.MATCHED;
        //   for await (const secondaryField of result.secondaryFieldResults) {
        //     if (
        //       ['UNKNOWN', 'NOT_MATCHED'].includes(secondaryField.fieldResult)
        //     ) {
        //       matchStatus = MatchStatus.NOT_MATCHED;
        //       break;
        //     }
        //   }

        //   if (MatchStatus.MATCHED === matchStatus) {
        //     const matchedResIdRefId = new ResultIdRefIdPair();
        //     matchedResIdRefId.resultId = result.resultId;
        //     matchedResIdRefId.referenceId = result.referenceId;
        //     matchedResultElement.push(matchedResIdRefId);
        //   }
        // }
      }

      // if (matchedResultElement.length > 0)
      // matchStatus = MatchStatus.MATCHED;
    }
    return {
      sanctionStatus: matchStatus,
      matchedResultElement: matchedResultElement,
      resultIdRefIdPairs: resultIdRefIdPairs,
    };
  }

  async findCustRefinitiv(leadId: string): Promise<ICustRefinitiv> {
    this.logger.log(this.findCustRefinitiv.name);
    return await this.custRefinitivRepository.findByLeadId(leadId);
  }
  save(custRefinitiv: ICustRefinitiv): Promise<ICustRefinitiv> {
    return this.custRefinitivRepository.save(custRefinitiv);
  }
}
