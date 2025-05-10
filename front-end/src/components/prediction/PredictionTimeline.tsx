import { formatTimeFromDate } from "@/utils";

type PredictionTimelineProps = {
  startDate: number;
  endDate: number;
  participationDeadline?: number;
};

export function PredictionTimeline({
  startDate,
  endDate,
  participationDeadline,
}: PredictionTimelineProps) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span>Start date:</span>
        <span className="text-muted-foreground">
          {formatTimeFromDate(new Date(startDate))}
        </span>
      </div>

      {participationDeadline && (
        <div className="flex items-center gap-2 justify-between">
          <span>Voting ends:</span>
          <span className="text-muted-foreground">
            {formatTimeFromDate(new Date(participationDeadline))}
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 justify-between">
        <span>End date:</span>
        <span className="text-muted-foreground">
          {formatTimeFromDate(new Date(endDate))}
        </span>
      </div>
    </div>
  );
}
