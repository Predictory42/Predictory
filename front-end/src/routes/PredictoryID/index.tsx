import { type FC, useState } from "react";
import { Link, useParams } from "react-router";
import { Button } from "@/shadcn/ui/button";
import { ArrowLeft, Edit, AlertCircle, Clock } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import useAllEvents from "@/contract/queries/view/all/useAllEvents";
import { StatusBadge } from "@/components/StatusBadge";
import { getPredictionStatus, PredictionStatus } from "@/utils/status";
import { Separator } from "@/shadcn/ui/separator";
import { bnToUuid, bufferToString } from "@/contract/utils";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { EditPredictionDialog } from "@/components/edit-prediction-dialog";
import { Badge } from "@/shadcn/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/shadcn/ui/alert";
import { MagicLoading } from "@/components/MagicLoading";
import { PredictionOptions } from "@/components/prediction/PredictionOptions";
import type { PredictionOption } from "@/components/prediction/OptionCard";
import { PredictionCreatorInfo } from "@/components/prediction/PredictionCreatorInfo";
import { PredictionTimeline } from "@/components/prediction/PredictionTimeline";
import { PredictionMetadata } from "@/components/prediction/PredictionMetadata";
import { PredictionActions } from "@/components/prediction/PredictionActions";
import { PredictionChart } from "@/components/prediction/PredictionChart";
import useVote from "@/contract/queries/action/useVote";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shadcn/ui/card";

import useParticipants from "@/contract/queries/view/all/useParticipants";

export const PredictoryID: FC = () => {
  const { publicKey } = useWallet();
  const { id } = useParams();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [ownerSelectedOption, setOwnerSelectedOption] = useState<number | null>(
    null,
  );

  const { mutateAsync: vote, isPending: isVoting } = useVote();

  const { data: events, isLoading } = useAllEvents();
  const prediction = events?.find((event) => bnToUuid(event.id) === id);

  const { data: participants } = useParticipants();
  const participant = participants?.find(
    (participant) =>
      participant.eventId.toString() === prediction?.id.toString() &&
      participant.payer.toBase58() === publicKey?.toBase58(),
  );

  const currentStatus = prediction
    ? getPredictionStatus({
        startDate: prediction.startDate,
        endDate: prediction.endDate,
        participationDeadline: prediction.participationDeadline,
        canceled: prediction.canceled,
      })
    : PredictionStatus.NOT_STARTED;

  const parsedOptions = prediction
    ? prediction.options
        .map((option) => ({
          title: option.description ? bufferToString(option.description) : "-",
          votes: option.votes?.toNumber() ?? 0,
          value: option.vaultBalance
            ? (option.vaultBalance?.toNumber() / LAMPORTS_PER_SOL).toFixed(2)
            : 0,
          index: option.index,
        }))
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    : [];

  const resultIndex = prediction?.result != null ? prediction.result : -1;

  const isUserOwner = Boolean(
    publicKey?.toBase58() === prediction?.authority.toBase58(),
  );
  const predictionName = prediction?.name
    ? bufferToString(prediction.name)
    : "Untitled";
  const isActive = currentStatus === PredictionStatus.ACTIVE;
  const isEnded = currentStatus === PredictionStatus.ENDED;
  const isCanceled = currentStatus === PredictionStatus.CANCELED;

  const userVoteIndex = participant?.option ?? -1;
  const hasUserParticipated = userVoteIndex >= 0;
  const isClaimed = Boolean(hasUserParticipated && participant?.isClaimed);
  const didUserWin = Boolean(
    hasUserParticipated && resultIndex === userVoteIndex,
  );

  const handleOptionSelect = (option: PredictionOption) => {
    if (option.index === undefined) return;
    if (isUserOwner && isEnded && resultIndex === -1) {
      setOwnerSelectedOption(option.index);
    } else if (isActive) {
      setSelectedOption(option.index);
    }
  };

  const handleParticipate = async (optionIndex: number, amount: number) => {
    if (!prediction) return;

    await vote({
      eventId: prediction.id.toString(),
      userVoteIndex: optionIndex,
      amount: amount * LAMPORTS_PER_SOL,
    });
    setSelectedOption(null);
  };

  if (isLoading) return <MagicLoading />;

  if (!prediction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-8" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Predictions
          </Link>
        </Button>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold">Prediction not found</h2>
        </div>
      </div>
    );
  }

  // Calculate time left for owner to select result (24 hours after event ends)
  const timeLeftToSelectResult =
    isEnded && resultIndex === -1 && isUserOwner
      ? prediction.endDate.toNumber() + 24 * 60 * 60 * 1000 - Date.now() / 1000
      : 0;
  const hoursLeft = Math.floor(timeLeftToSelectResult / (1000 * 60 * 60));
  const minutesLeft = Math.floor(
    (timeLeftToSelectResult % (1000 * 60 * 60)) / (1000 * 60),
  );

  // Calculate the selectedOptionIndex for the PredictionActions component
  const selectedOptionIndex =
    ownerSelectedOption !== null ? ownerSelectedOption : undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Predictions
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {isUserOwner && currentStatus === PredictionStatus.NOT_STARTED && (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="w-4 h-4" />
              <span className="hidden md:block">Edit Prediction</span>
            </Button>
          )}
        </div>
      </div>

      {isUserOwner && resultIndex === -1 && (
        <Alert className="mb-6 border-amber-500 bg-amber-500/20 text-amber-500">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Owner Action Required</AlertTitle>
          <AlertDescription className="flex flex-col gap-1">
            <p>
              You must select a result within 24 hours after the event has
              ended, or you'll lose part of your stake and trust tokens.
            </p>
            {isEnded && (
              <div className="flex items-center gap-2 mt-1 text-amber-600">
                <Clock className="h-4 w-4" />
                <span>
                  Time left: {hoursLeft}h {minutesLeft}m
                </span>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {isCanceled && hasUserParticipated && (
        <Alert className="mb-6 border-blue-500 bg-blue-500/20">
          <AlertCircle className="h-5 w-5 text-blue-500" />
          <AlertTitle className="text-blue-500">Event Canceled</AlertTitle>
          <AlertDescription>
            This event has been canceled. You can claim a refund for your stake.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-popover/30 backdrop-blur-sm overflow-hidden mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl font-bold">
                  {predictionName}
                </CardTitle>
                <StatusBadge status={currentStatus} />
              </div>
            </CardHeader>
            <Separator />

            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:flex md:flex-row md:justify-between md:items-stretch gap-4 mb-6">
                <div className="flex-1">
                  <h3 className="text-sm font-medium mb-2">
                    Prediction Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Organizer:</span>
                      <PredictionCreatorInfo
                        address={prediction.authority.toBase58()}
                      />
                    </div>

                    <PredictionMetadata
                      poolSize={
                        prediction.stake ? prediction.stake.toNumber() : 0
                      }
                      optionsCount={prediction.options.length}
                      resultTitle={
                        resultIndex >= 0
                          ? parsedOptions[resultIndex]?.title
                          : undefined
                      }
                      showCancelOption={resultIndex >= 0 && isUserOwner}
                    />
                  </div>
                </div>

                <Separator orientation="vertical" className="hidden md:block" />
                <Separator className=" md:hidden" />

                <div className="flex-1">
                  <h3 className="text-sm font-medium mb-2">Timeline</h3>
                  <PredictionTimeline
                    startDate={prediction.startDate.toNumber()}
                    endDate={prediction.endDate.toNumber()}
                    participationDeadline={prediction.participationDeadline?.toNumber()}
                  />
                </div>
              </div>

              <PredictionChart options={parsedOptions} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-popover/30 backdrop-blur-sm overflow-hidden sticky top-6">
            <CardHeader>
              <CardTitle className="text-xl">Options</CardTitle>
              {isActive ? (
                <p className="text-sm text-muted-foreground">
                  Select an option to participate
                </p>
              ) : (
                resultIndex >= 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary"
                    >
                      Result: {parsedOptions[resultIndex]?.title}
                    </Badge>
                  </div>
                )
              )}

              {isUserOwner && isEnded && resultIndex === -1 && (
                <CardDescription className="text-amber-500 mt-2 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Select the winning option below
                </CardDescription>
              )}
            </CardHeader>
            <Separator />

            <CardContent className="pt-4">
              <PredictionOptions
                options={parsedOptions}
                currentStatus={currentStatus}
                totalStake={prediction.stake ? prediction.stake.toNumber() : 0}
                resultIndex={resultIndex}
                userVoteIndex={userVoteIndex}
                userStake={
                  participant?.depositedAmount
                    ? participant.depositedAmount.toNumber()
                    : 0
                }
                selectedOption={selectedOption}
                ownerSelectedOption={ownerSelectedOption}
                isOwnerSelecting={Boolean(
                  isUserOwner && isEnded && resultIndex === -1,
                )}
                isOwner={isUserOwner}
                onOptionSelect={handleOptionSelect}
                onStakeSubmit={handleParticipate}
                isSubmitting={isVoting}
              />

              {isActive && selectedOption !== null && (
                <p className="text-xs text-center text-primary mt-4">
                  You selected: {parsedOptions[selectedOption]?.title}
                </p>
              )}
            </CardContent>

            <CardFooter>
              <PredictionActions
                predictionId={prediction.id}
                selectedOptionIndex={selectedOptionIndex}
                isEnded={isEnded}
                isCanceled={isCanceled}
                isUserOwner={isUserOwner}
                hasUserParticipated={hasUserParticipated}
                resultIndex={resultIndex}
                didUserWin={didUserWin}
                isClaimed={isClaimed}
                ownerSelectedResult={ownerSelectedOption !== null}
              />
            </CardFooter>
          </Card>
        </div>
      </div>

      <EditPredictionDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        prediction={prediction}
      />
    </div>
  );
};
