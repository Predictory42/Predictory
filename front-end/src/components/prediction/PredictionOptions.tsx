import { cn } from "@/shadcn/utils";
import { CheckCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shadcn/ui/tooltip";
import { PredictionStatus } from "@/utils/status";

export type PredictionOption = {
  title: string;
  votes: number;
  value: string | number;
};

type PredictionOptionsProps = {
  options: PredictionOption[];
  currentStatus: PredictionStatus;
  totalStake: number;
  resultIndex?: number;
  userVoteIndex?: number;
  selectedOption?: string | null;
  ownerSelectedOption?: string | null;
  isOwnerSelecting?: boolean;
  onOptionSelect?: (optionIndex: string) => void;
};

export function PredictionOptions({
  options,
  currentStatus,
  totalStake,
  resultIndex = -1,
  userVoteIndex = -1,
  selectedOption = null,
  ownerSelectedOption = null,
  isOwnerSelecting = false,
  onOptionSelect,
}: PredictionOptionsProps) {
  const isActive = currentStatus === PredictionStatus.ACTIVE;
  const isEnded = currentStatus === PredictionStatus.ENDED;

  return (
    <div className="space-y-2">
      {options.map((option, index) => {
        const percentage = (
          (Number(option.value) / Number(totalStake)) *
          100
        ).toFixed(0);
        const isWinner = resultIndex === index;
        const isUserVote = userVoteIndex === index;
        const isOptionSelected = selectedOption === index.toString();
        const isOwnerSelected = ownerSelectedOption === index.toString();

        return (
          <div
            key={index}
            className={cn(
              "relative flex items-center justify-between gap-2 border rounded-md py-2 px-3 border-border overflow-hidden",
              isWinner
                ? "border-primary"
                : isEnded
                  ? "opacity-50"
                  : "opacity-100",
              isActive &&
                onOptionSelect &&
                "cursor-pointer hover:border-primary/50 hover:scale-105 transition-all duration-300",
              isOptionSelected && "scale-105 border-primary/50",
              isOwnerSelected && "border-amber-500 scale-105",
            )}
            onClick={() => {
              if ((isActive || isOwnerSelecting) && onOptionSelect) {
                onOptionSelect(index.toString());
              }
            }}
          >
            <div
              className={cn(
                "absolute top-0 left-0 h-full bg-gradient-to-r",
                isWinner
                  ? "from-primary/70 to-primary/30"
                  : isOwnerSelected
                    ? "from-amber-500/50 to-amber-500/20"
                    : "from-primary/50 to-secondary/20",
              )}
              style={{ width: `${percentage}%` }}
            />

            <div className="relative z-10 flex flex-col w-full">
              <div className="flex justify-between w-full items-center">
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isWinner && "font-bold",
                      isOwnerSelected && "text-amber-500 font-bold",
                    )}
                  >
                    {option.title}
                  </p>
                  {isUserVote && (
                    <Tooltip>
                      <TooltipTrigger>
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </TooltipTrigger>
                      <TooltipContent>You voted for this option</TooltipContent>
                    </Tooltip>
                  )}
                </div>
                <p className="text-sm font-medium">{option.value} SOL</p>
              </div>
              <div className="flex justify-between w-full">
                <p className="text-xs text-muted-foreground">
                  Votes: {option.votes}
                </p>
                <p className="text-xs text-muted-foreground">{percentage}%</p>
              </div>
            </div>

            {isActive && isOptionSelected && (
              <div className="absolute inset-0 border-2 border-primary rounded-md pointer-events-none" />
            )}
          </div>
        );
      })}
    </div>
  );
}
