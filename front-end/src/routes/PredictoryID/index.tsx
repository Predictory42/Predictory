import { type FC, useState } from "react";
import { Link, useParams } from "react-router";
import { Button } from "@/shadcn/ui/button";
import {
  ArrowLeft,
  Edit,
  CheckCircle,
  XCircle,
  Award,
  BadgeAlert,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import useAllEvents from "@/contract/queries/view/all/useAllEvents";
import { StatusBadge } from "@/components/StatusBadge";
import { getPredictionStatus, PredictionStatus } from "@/utils/status";
import { Separator } from "@/shadcn/ui/separator";
import { bufferToString } from "@/contract/utils";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { EditPredictionDialog } from "@/components/edit-prediction-dialog";
import { Badge } from "@/shadcn/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/shadcn/ui/alert";
import { MagicLoading } from "@/components/MagicLoading";
import { PredictionOptions } from "@/components/prediction/PredictionOptions";
import type { PredictionOption } from "@/components/prediction/PredictionOptions";
import { PredictionCreatorInfo } from "@/components/prediction/PredictionCreatorInfo";
import { PredictionTimeline } from "@/components/prediction/PredictionTimeline";
import { PredictionMetadata } from "@/components/prediction/PredictionMetadata";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shadcn/ui/card";

export const PredictoryID: FC = () => {
  const { publicKey } = useWallet();
  const { id } = useParams();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [ownerSelectedResult, setOwnerSelectedResult] = useState<string | null>(
    null,
  );

  const { data: events, isLoading } = useAllEvents();
  const prediction = events?.find((event) => event.id.toString() === id);

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

  const currentStatus = getPredictionStatus({
    startDate: prediction.startDate,
    endDate: prediction.endDate,
    participationDeadline: prediction.participationDeadline,
    canceled: prediction.canceled,
  });

  const parsedOptions: PredictionOption[] = prediction.options.map(
    (option) => ({
      title: option.description ? bufferToString(option.description) : "-",
      votes: option.votes?.toNumber() ?? 0,
      value: option.vaultBalance
        ? (option.vaultBalance?.toNumber() / LAMPORTS_PER_SOL).toFixed(2)
        : 0,
    }),
  );

  const resultIndex = prediction.result != null ? prediction.result : -1;
  const isUserOwner = publicKey?.toBase58() === prediction.authority.toBase58();
  const predictionName = prediction.name
    ? bufferToString(prediction.name)
    : "Untitled";
  const isActive = currentStatus === PredictionStatus.ACTIVE;
  const isEnded = currentStatus === PredictionStatus.ENDED;
  const isCanceled = currentStatus === PredictionStatus.CANCELED;

  // TODO: Mock user vote index, implement
  const mockUserVoteIndex = 1;
  const hasUserParticipated = mockUserVoteIndex >= 0;
  const didUserWin = hasUserParticipated && resultIndex === mockUserVoteIndex;

  // Calculate time left for owner to select result (24 hours after event ends)
  const timeLeftToSelectResult =
    isEnded && resultIndex === -1 && isUserOwner
      ? prediction.endDate.toNumber() + 24 * 60 * 60 * 1000 - Date.now()
      : 0;
  const hoursLeft = Math.floor(timeLeftToSelectResult / (1000 * 60 * 60));
  const minutesLeft = Math.floor(
    (timeLeftToSelectResult % (1000 * 60 * 60)) / (1000 * 60),
  );

  //TODO implement method
  const handleCancelEvent = () => {
    console.log("Canceling event");
  };

  //TODO implement method
  const handleCancelResult = () => {
    console.log("Canceling result");
  };

  //TODO implement method
  const handleParticipate = () => {
    if (selectedOption && isActive) {
      console.log(`Voting for option: ${selectedOption}`);
      setSelectedOption(null);
    }
  };

  //TODO implement method
  const handleClaimReward = () => {
    console.log("Claiming reward");
  };

  //TODO implement method
  const handleContestResult = () => {
    console.log("Contesting result");
  };

  //TODO implement method
  const handleClaimRefund = () => {
    console.log("Claiming refund");
  };

  //TODO implement method
  const handleSubmitResult = () => {
    if (ownerSelectedResult) {
      console.log(`Setting result to: ${ownerSelectedResult}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Predictions
          </Link>
        </Button>

        {isUserOwner && currentStatus === PredictionStatus.NOT_STARTED && (
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit className="w-4 h-4" />
            Edit Prediction
          </Button>
        )}

        {isUserOwner && !isCanceled && (
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={handleCancelEvent}
          >
            <XCircle className="w-4 h-4" />
            Cancel Event
          </Button>
        )}
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
                      onCancelResult={
                        resultIndex >= 0 && isUserOwner
                          ? handleCancelResult
                          : undefined
                      }
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

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">
                  Options Distribution
                </h3>
                <div className="h-64 bg-muted/50 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Chart will be displayed here
                  </p>
                </div>
              </div>
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
                userVoteIndex={mockUserVoteIndex}
                selectedOption={selectedOption}
                ownerSelectedOption={ownerSelectedResult}
                isOwnerSelecting={isUserOwner && isEnded && resultIndex === -1}
                onOptionSelect={(optionIndex) => {
                  if (isActive) {
                    setSelectedOption(optionIndex);
                  } else if (isUserOwner && isEnded && resultIndex === -1) {
                    setOwnerSelectedResult(optionIndex);
                  }
                }}
              />

              {isActive && selectedOption && (
                <p className="text-xs text-center text-primary mt-4">
                  You selected: {parsedOptions[parseInt(selectedOption)]?.title}
                </p>
              )}
            </CardContent>

            {!isActive && isUserOwner && isEnded && resultIndex === -1 && (
              <CardFooter>
                <div className="w-full space-y-2">
                  <p className="text-xs text-center text-muted-foreground">
                    {ownerSelectedResult
                      ? `Selected: ${parsedOptions[parseInt(ownerSelectedResult)]?.title}`
                      : "Select the winning option above"}
                  </p>
                  <Button
                    variant="default"
                    disabled={!ownerSelectedResult}
                    className="w-full"
                    onClick={handleSubmitResult}
                  >
                    Submit Result
                  </Button>
                </div>
              </CardFooter>
            )}

            {hasUserParticipated && resultIndex !== -1 && !isUserOwner && (
              <CardFooter className="flex flex-col gap-3">
                {didUserWin && (
                  <Button
                    onClick={handleClaimReward}
                    className="w-full gap-2"
                    variant="default"
                  >
                    <Award className="h-4 w-4" />
                    Claim Reward
                  </Button>
                )}

                <Button
                  onClick={handleContestResult}
                  className="w-full gap-2"
                  variant="destructive"
                >
                  <BadgeAlert className="h-4 w-4" />
                  Contest Result
                </Button>
              </CardFooter>
            )}

            {isCanceled && hasUserParticipated && !isUserOwner && (
              <CardFooter className="flex justify-center">
                <Button onClick={handleClaimRefund} className="gap-2 w-full">
                  <CheckCircle className="h-4 w-4" />
                  Claim Refund
                </Button>
              </CardFooter>
            )}

            {isActive && (
              <CardFooter>
                <Button
                  onClick={handleParticipate}
                  disabled={!selectedOption}
                  className="gap-2 w-full"
                  variant="secondary"
                >
                  <CheckCircle className="h-4 w-4" />
                  Participate
                </Button>
              </CardFooter>
            )}
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
