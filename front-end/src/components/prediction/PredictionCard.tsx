import { Card, CardTitle } from "@/shadcn/ui/card";
import { Button } from "@/shadcn/ui/button";
import { cn } from "@/shadcn/utils";
import { bufferToString } from "@/contract/utils";
import { useState } from "react";
import { Separator } from "@/shadcn/ui/separator";
import type { AllEvents } from "@/types/predictory";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getPredictionStatus, PredictionStatus } from "@/utils/status";
import { StatusBadge } from "@/components/StatusBadge";
import { ExternalLink } from "lucide-react";
import { APP_ROUTES } from "@/routes/constants";
import { Link } from "react-router";
import { PredictionOptions } from "@/components/prediction/PredictionOptions";
import type { PredictionOption } from "@/components/prediction/PredictionOptions";
import { PredictionCreatorInfo } from "@/components/prediction/PredictionCreatorInfo";
import { PredictionTimeline } from "@/components/prediction/PredictionTimeline";
import useVote from "@/contract/queries/action/useVote";

type PredictionCardProps = {
  prediction: Pick<
    AllEvents,
    | "authority"
    | "stake"
    | "startDate"
    | "endDate"
    | "participationDeadline"
    | "canceled"
    | "name"
    | "options"
    | "result"
    | "id"
  >;
  userVoteIndex?: number;
};

export function PredictionCard({
  prediction,
  userVoteIndex = -1,
}: PredictionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const { mutateAsync: vote, isPending: isVoting } = useVote();

  const participate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await vote({
      eventId: prediction.id.toString(),
      userVoteIndex: parseInt(selectedOption ?? "0"),
      amount: 0.01,
    });
    setSelectedOption(null);
  };

  const parsedOptions: PredictionOption[] = prediction.options.map(
    (option) => ({
      title: option.description ? bufferToString(option.description) : "-",
      votes: option.votes?.toNumber() ?? 0,
      value: option.vaultBalance
        ? (option.vaultBalance?.toNumber() / LAMPORTS_PER_SOL).toFixed(2)
        : 0,
    }),
  );

  const currentStatus = getPredictionStatus({
    startDate: prediction.startDate,
    endDate: prediction.endDate,
    participationDeadline: prediction.participationDeadline,
    canceled: prediction.canceled,
  });

  const isActive = currentStatus === PredictionStatus.ACTIVE;

  const resultIndex = prediction.result != null ? prediction.result : -1;

  return (
    <Card
      className={cn(
        "bg-popover/30 backdrop-blur-sm w-full h-full gap-2 p-0 pb-4 hover:shadow-lg transition-all duration-300",
      )}
    >
      <div className="flex items-center justify-between p-4 pb-0">
        <CardTitle className="text-2xl font-bold">
          {prediction.name ? bufferToString(prediction.name) : "Untitled"}
        </CardTitle>
        <div className="flex items-center gap-2">
          <StatusBadge status={currentStatus} />
          <Link
            to={APP_ROUTES.PREDICTORY_ID(prediction.id.toString())}
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink size={16} />
          </Link>
        </div>
      </div>

      <Separator />

      <div className="text-sm flex flex-col gap-1 px-4 py-2">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2">Organizer:</p>
          <PredictionCreatorInfo address={prediction.authority.toBase58()} />
        </div>
      </div>

      <div className="flex flex-col gap-1 px-4">
        <PredictionTimeline
          startDate={prediction.startDate.toNumber()}
          endDate={prediction.endDate.toNumber()}
          participationDeadline={prediction.participationDeadline?.toNumber()}
        />
      </div>

      <div className="text-sm flex items-center justify-between gap-2 px-4 mt-1">
        <p className="flex items-center gap-2">Pool size:</p>
        <span className="text-muted-foreground flex items-center gap-1">
          {prediction.stake
            ? (prediction.stake.toNumber() / LAMPORTS_PER_SOL).toFixed(2)
            : 0}
          <span className="text-muted-foreground">SOL</span>
        </span>
      </div>

      <div className="flex flex-col justify-between gap-2 px-4 mt-2">
        <PredictionOptions
          options={parsedOptions}
          currentStatus={currentStatus}
          totalStake={prediction.stake ? prediction.stake.toNumber() : 0}
          resultIndex={resultIndex}
          userVoteIndex={userVoteIndex}
          selectedOption={selectedOption}
          onOptionSelect={isActive ? setSelectedOption : undefined}
        />
      </div>

      {isActive && (
        <div className="pt-2 px-4 flex flex-col gap-2">
          {selectedOption && (
            <p className="text-xs text-center text-primary">
              You selected: {parsedOptions[parseInt(selectedOption)]?.title}
            </p>
          )}
          <Button
            variant="default"
            size="lg"
            disabled={!selectedOption || isVoting}
            loading={isVoting}
            onClick={participate}
            className={cn(
              "w-full text-foreground bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all",
              "shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
              !selectedOption && "pointer-events-none",
            )}
          >
            Participate Now
          </Button>
        </div>
      )}
    </Card>
  );
}
