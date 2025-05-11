import { Badge } from "@/shadcn/ui/badge";
import { PredictionStatus } from "@/utils/status";

type StatusVariant = "outline" | "default" | "secondary" | "destructive";

export function StatusBadge({ status }: { status: PredictionStatus }) {
  const statusConfig: Record<
    PredictionStatus,
    { text: string; variant: StatusVariant }
  > = {
    [PredictionStatus.NOT_STARTED]: {
      text: "Not Started",
      variant: "outline",
    },
    [PredictionStatus.ACTIVE]: {
      text: "Active",
      variant: "default",
    },
    [PredictionStatus.PARTICIPATION_CLOSED]: {
      text: "Participation Closed",
      variant: "secondary",
    },
    [PredictionStatus.ENDED]: {
      text: "Ended",
      variant: "destructive",
    },
    [PredictionStatus.CANCELED]: {
      text: "Canceled",
      variant: "destructive",
    },
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.text}</Badge>;
}
