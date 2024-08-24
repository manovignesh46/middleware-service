import { ThresholdConfigStatus } from '../../../../domain/enum/thresholdConfigStatus.enum';

export class ThresholdConfigs {
  forItem: string;
  minPercentage: number;
  outputStatus: ThresholdConfigStatus;
}

export async function getThresholdConfigStatus(
  forItem: string,
  givenPercentage: number,
  thresholdConfigs: ThresholdConfigs[],
): Promise<ThresholdConfigStatus> {
  let diff = 100;
  let status = ThresholdConfigStatus.NO;
  for await (const thresholdConfig of thresholdConfigs) {
    if (thresholdConfig.forItem === forItem) {
      if (
        givenPercentage >= thresholdConfig.minPercentage &&
        diff > givenPercentage - thresholdConfig.minPercentage
      ) {
        status = thresholdConfig.outputStatus;
        diff = givenPercentage - thresholdConfig.minPercentage;
      }
    }
  }
  return status;
}
