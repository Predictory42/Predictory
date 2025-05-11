import { Button } from "@/shadcn/ui/button";
import { Award, BadgeAlert, CheckCircle, XCircle } from "lucide-react";
import useCancelEvent from "@/contract/queries/action/useCancelEvent";
import useCompleteEvent from "@/contract/queries/action/useCompleteEvent";
import useClaimEventReward from "@/contract/queries/action/useClaimEventReward";
import type { BN } from "@coral-xyz/anchor";
import useRecharge from "@/contract/queries/action/useRechcarge";

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "default" | "destructive" | "secondary";
}

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  isLoading,
  variant = "default",
  ...props
}) => (
  <Button variant={variant} className="w-full" disabled={isLoading} {...props}>
    {isLoading ? (
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Loading...
      </div>
    ) : (
      <div className="flex items-center gap-2">{children}</div>
    )}
  </Button>
);

interface PredictionActionsProps {
  predictionId: BN;
  selectedOptionIndex?: number;
  isEnded: boolean;
  isCanceled: boolean;
  isUserOwner: boolean;
  hasUserParticipated: boolean;
  resultIndex: number;
  didUserWin: boolean;
  isClaimed: boolean;
  ownerSelectedResult: boolean;
}

export const PredictionActions: React.FC<PredictionActionsProps> = ({
  predictionId,
  selectedOptionIndex,
  isEnded,
  isCanceled,
  isUserOwner,
  hasUserParticipated,
  resultIndex,
  didUserWin,
  isClaimed,
  ownerSelectedResult,
}) => {
  const { mutateAsync: cancelEvent, isPending: isCanceling } = useCancelEvent();
  const { mutateAsync: submitResult, isPending: isSubmitting } =
    useCompleteEvent();
  const { mutateAsync: claimReward, isPending: isClaiming } =
    useClaimEventReward();
  const { mutateAsync: recharge, isPending: isRecharging } = useRecharge();

  const handleClaimReward = async () => {
    await claimReward({
      eventId: predictionId.toString(),
      optionIndex: resultIndex,
    });
  };

  const handleContestResult = async () => {
    // TODO: Implement contest result logic
    console.log("Contesting result");
  };

  const handleClaimRefund = async () => {
    await recharge({ eventId: predictionId.toString() });
  };

  const handleCancelEvent = async () => {
    await cancelEvent({ eventId: predictionId.toString() });
  };

  const handleSubmitResult = async () => {
    if (selectedOptionIndex === undefined) return;

    await submitResult({
      eventId: predictionId.toString(),
      optionIndex: selectedOptionIndex,
    });
  };

  if (isUserOwner && isEnded && resultIndex === -1) {
    return (
      <ActionButton
        onClick={handleSubmitResult}
        isLoading={isSubmitting}
        disabled={!ownerSelectedResult}
      >
        Submit Result
      </ActionButton>
    );
  }

  if (hasUserParticipated && resultIndex !== -1 && !isUserOwner) {
    return (
      <div className="flex flex-col gap-3">
        {didUserWin && !isClaimed && (
          <ActionButton onClick={handleClaimReward} isLoading={isClaiming}>
            <Award className="h-4 w-4" />
            Claim Reward
          </ActionButton>
        )}

        <ActionButton
          onClick={handleContestResult}
          isLoading={false}
          variant="destructive"
        >
          <BadgeAlert className="h-4 w-4" />
          Contest Result
        </ActionButton>
      </div>
    );
  }

  if (isCanceled && hasUserParticipated && !isUserOwner) {
    return (
      <ActionButton onClick={handleClaimRefund} isLoading={isRecharging}>
        <CheckCircle className="h-4 w-4" />
        Claim Refund
      </ActionButton>
    );
  }

  if (isUserOwner && !isCanceled && !isEnded) {
    return (
      <ActionButton
        onClick={handleCancelEvent}
        isLoading={isCanceling}
        variant="destructive"
      >
        <XCircle className="h-4 w-4" />
        Cancel Event
      </ActionButton>
    );
  }

  return null;
};
