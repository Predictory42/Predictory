import { formatDateTimeCompact } from "@/utils";

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
          {formatDateTimeCompact(new Date(startDate * 1000))}
        </span>
      </div>

      {participationDeadline && (
        <div className="flex items-center gap-2 justify-between">
          <span>Voting ends:</span>
          <span className="text-muted-foreground">
            {formatDateTimeCompact(new Date(participationDeadline * 1000))}
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 justify-between">
        <span>End date:</span>
        <span className="text-muted-foreground">
          {formatDateTimeCompact(new Date(endDate * 1000))}
        </span>
      </div>
    </div>
  );
}
