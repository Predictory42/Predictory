import { cn } from "@/shadcn/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shadcn/ui/tooltip";
import { PredictionStatus } from "@/utils/status";
import { personImage } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";

export type PredictionOption = {
  title: string;
  votes: number;
  value: string | number;
  index: number | undefined;
};

type OptionCardProps = {
  option: PredictionOption;
  currentStatus: PredictionStatus;
  totalStake: number;
  isWinner: boolean;
  hasUserParticipated: boolean;
  isUserVote: boolean;
  userStake?: number;
  isSelected?: boolean;
  isOwnerSelected?: boolean;
  isOwnerSelecting?: boolean;
  isOwner?: boolean;
  onSelect?: (option: PredictionOption) => void;
  isScrollable?: boolean;
};

export function OptionCard({
  option,
  currentStatus,
  totalStake,
  isWinner,
  isUserVote,
  hasUserParticipated,
  userStake = 0,
  isSelected = false,
  isOwnerSelected = false,
  isOwnerSelecting = false,
  isOwner = false,
  onSelect,
  isScrollable = false,
}: OptionCardProps) {
  const { publicKey } = useWallet();
  const isActive = currentStatus === PredictionStatus.ACTIVE;
  const isEnded = currentStatus === PredictionStatus.ENDED;

  const percentage = (
    (Number(option.value) / Number(totalStake)) *
    100
  ).toFixed(0);

  const handleClick = () => {
    if ((isActive && onSelect && !isOwner) || (isOwnerSelecting && onSelect)) {
      onSelect(option);
    }
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-between gap-2 border rounded-md py-2 px-3 border-border overflow-hidden",
        isWinner ? "border-primary" : isEnded ? "opacity-50" : "opacity-100",
        isActive &&
          onSelect &&
          // !isOwner &&
          "cursor-pointer hover:border-primary/50 hover:scale-105 transition-all duration-300",
        isSelected && "scale-105 border-primary/50",
        isOwnerSelected && "border-amber-500 scale-105",
        isScrollable && "hover:scale-100",
        hasUserParticipated &&
          "hover:scale-100 hover:border-border cursor-not-allowed",
      )}
      onClick={handleClick}
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
                  <img
                    src={personImage(publicKey?.toBase58() || "")}
                    alt="Avatar"
                    className="size-5 border-1 border-primary rounded-full"
                  />
                </TooltipTrigger>
                <TooltipContent>You voted for this option</TooltipContent>
              </Tooltip>
            )}
          </div>
          <p className="text-sm font-medium">{option.value} SOL</p>
        </div>
        <div className="flex justify-between w-full">
          <p className="text-xs text-muted-foreground">Votes: {option.votes}</p>
          <div className="flex gap-2">
            {isUserVote && userStake > 0 && (
              <p className="text-xs text-muted-foreground">
                Your stake: {(userStake / 1e9).toFixed(2)} SOL
              </p>
            )}
            <p className="text-xs text-muted-foreground">{percentage}%</p>
          </div>
        </div>
      </div>

      {isActive && isSelected && (
        <div className="absolute inset-0 border-2 border-primary rounded-md pointer-events-none" />
      )}
    </div>
  );
}
