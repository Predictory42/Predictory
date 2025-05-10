import type { Event } from "@/types/predictory";

import { getCurrentTime } from "./index";

export enum PredictionStatus {
  NOT_STARTED = "NOT_STARTED",
  ACTIVE = "ACTIVE",
  PARTICIPATION_CLOSED = "PARTICIPATION_CLOSED",
  ENDED = "ENDED",
  CANCELED = "CANCELED",
}

export function getPredictionStatus(
  prediction: Pick<
    Event,
    "startDate" | "endDate" | "participationDeadline" | "canceled"
  >,
): PredictionStatus {
  const currentTime = getCurrentTime();

  const { startDate, endDate, participationDeadline, canceled } = prediction;

  if (canceled) {
    return PredictionStatus.CANCELED;
  }

  if (currentTime.lt(startDate)) {
    return PredictionStatus.NOT_STARTED;
  }

  if (
    participationDeadline &&
    currentTime.gt(participationDeadline) &&
    currentTime.lt(endDate)
  ) {
    return PredictionStatus.PARTICIPATION_CLOSED;
  }

  if (currentTime.gte(endDate)) {
    return PredictionStatus.ENDED;
  }

  return PredictionStatus.ACTIVE;
}
