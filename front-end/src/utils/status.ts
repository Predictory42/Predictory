import type { Event } from "@/types/predictory";

import { getCurrentTime } from "./index";
import BN from "bn.js";

export enum PredictionStatus {
  NOT_STARTED = "NOT_STARTED",
  ACTIVE = "ACTIVE",
  PARTICIPATION_CLOSED = "PARTICIPATION_CLOSED",
  ENDED = "ENDED",
  CANCELED = "CANCELED",
  WAITING_FOR_RESULT = "WAITING_FOR_RESULT",
}

export function getPredictionStatus(
  prediction: Pick<
    Event,
    "startDate" | "endDate" | "participationDeadline" | "canceled" | "result"
  >,
): PredictionStatus {
  const currentTime = getCurrentTime();

  const { startDate, endDate, participationDeadline, canceled, result } =
    prediction;

  const startDateInMs = startDate.mul(new BN(1000));
  const endDateInMs = endDate.mul(new BN(1000));
  const participationDeadlineInMs = participationDeadline
    ? participationDeadline.mul(new BN(1000))
    : undefined;

  if (canceled) {
    return PredictionStatus.CANCELED;
  }

  if (currentTime.lt(startDateInMs)) {
    return PredictionStatus.NOT_STARTED;
  }

  if (
    participationDeadlineInMs &&
    currentTime.gt(participationDeadlineInMs) &&
    currentTime.lt(endDateInMs)
  ) {
    return PredictionStatus.PARTICIPATION_CLOSED;
  }

  if (currentTime.gte(endDateInMs)) {
    if (result !== null) {
      return PredictionStatus.ENDED;
    }

    return PredictionStatus.WAITING_FOR_RESULT;
  }

  return PredictionStatus.ACTIVE;
}
