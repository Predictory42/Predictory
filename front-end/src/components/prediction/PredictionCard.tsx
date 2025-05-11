import { Card, CardTitle } from "@/shadcn/ui/card";
import { cn } from "@/shadcn/utils";
import { bnToUuid, bufferToString } from "@/contract/utils";
import { useState } from "react";
import { Separator } from "@/shadcn/ui/separator";
import type { AllEvents } from "@/types/predictory";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getPredictionStatus } from "@/utils/status";
import { StatusBadge } from "@/components/StatusBadge";
import { ExternalLink } from "lucide-react";
import { APP_ROUTES } from "@/routes/constants";
import { Link } from "react-router";
import { PredictionOptions } from "@/components/prediction/PredictionOptions";
import type { PredictionOption } from "@/components/prediction/OptionCard";
import { PredictionCreatorInfo } from "@/components/prediction/PredictionCreatorInfo";
import { PredictionTimeline } from "@/components/prediction/PredictionTimeline";
import useVote from "@/contract/queries/action/useVote";
import { useWallet } from "@solana/wallet-adapter-react";
import useParticipants from "@/contract/queries/view/all/useParticipants";

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
};

export function PredictionCard({ prediction }: PredictionCardProps) {
  const { publicKey } = useWallet();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const { data: participants } = useParticipants();
  const participant = participants?.find(
    (participant) =>
      participant.eventId.toString() === prediction?.id.toString() &&
      participant.payer.toBase58() === publicKey?.toBase58(),
  );

  const { mutateAsync: vote, isPending: isVoting } = useVote();

  const handleOptionSelect = (option: PredictionOption) => {
    setSelectedOption(option.index);
  };

  const handleParticipate = async (optionIndex: number, amount: number) => {
    await vote({
      eventId: prediction.id.toString(),
      userVoteIndex: optionIndex,
      amount: amount * LAMPORTS_PER_SOL,
    });
    setSelectedOption(null);
  };

  const parsedOptions = prediction.options.map((option) => ({
    title: option.description ? bufferToString(option.description) : "-",
    votes: option.votes?.toNumber() ?? 0,
    value: option.vaultBalance
      ? (option.vaultBalance?.toNumber() / LAMPORTS_PER_SOL).toFixed(2)
      : 0,
  }));

  const currentStatus = getPredictionStatus({
    startDate: prediction.startDate,
    endDate: prediction.endDate,
    participationDeadline: prediction.participationDeadline,
    canceled: prediction.canceled,
  });

  const resultIndex = prediction.result != null ? prediction.result : -1;
  const isOwner = prediction.authority.toBase58() === publicKey?.toBase58();

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
            to={APP_ROUTES.PREDICTORY_ID(bnToUuid(prediction.id))}
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
          userVoteIndex={participant?.option}
          selectedOption={selectedOption}
          onOptionSelect={handleOptionSelect}
          onStakeSubmit={handleParticipate}
          isSubmitting={isVoting}
          isOwner={isOwner}
          isScrollable={true}
        />
      </div>
    </Card>
  );
}
