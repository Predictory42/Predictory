import { useMemo, useState } from "react";
import { PredictionStatus } from "@/utils/status";
import { StakeModal } from "./StakeModal";
import { OptionCard, type PredictionOption } from "./OptionCard";
import { cn } from "@/shadcn/utils";

type PredictionOptionsProps = {
  options: PredictionOption[];
  currentStatus: PredictionStatus;
  resultIndex?: number;
  userVoteIndex?: number;
  userStake?: number;
  selectedOption?: number | null;
  ownerSelectedOption?: number | null;
  isOwnerSelecting?: boolean;
  isOwner?: boolean;
  onOptionSelect?: (option: PredictionOption) => void;
  onStakeSubmit?: (selectedOption: number, amount: number) => void;
  isSubmitting?: boolean;
  isScrollable?: boolean;
};

export function PredictionOptions({
  options,
  currentStatus,
  resultIndex = -1,
  userVoteIndex = -1,
  userStake = 0,
  selectedOption = null,
  ownerSelectedOption = null,
  isOwnerSelecting = false,
  isOwner = false,
  onOptionSelect,
  onStakeSubmit,
  isSubmitting = false,
  isScrollable = false,
}: PredictionOptionsProps) {
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [selectedOptionForStake, setSelectedOptionForStake] =
    useState<PredictionOption | null>(null);

  const hasUserParticipated = userVoteIndex >= 0;

  const handleOptionSelect = (option: PredictionOption) => {
    if (
      isOwnerSelecting &&
      onOptionSelect &&
      //TODO: remove this option after presentation
      currentStatus === PredictionStatus.ENDED
    ) {
      onOptionSelect(option);
    } else if (onOptionSelect) {
      setSelectedOptionForStake(option);
      setIsStakeModalOpen(true);
    }
  };

  const parsedOptions = useMemo(
    () => options.sort((a, b) => (a.index ?? 0) - (b.index ?? 0)),
    [options],
  );

  return (
    <div
      className={cn(
        "space-y-2",
        isScrollable && "overflow-y-auto max-h-[140px] no-scrollbar",
      )}
    >
      {parsedOptions.map((option) => (
        <OptionCard
          key={option.index}
          option={option}
          currentStatus={currentStatus}
          isWinner={resultIndex === option.index}
          isUserVote={userVoteIndex === option.index}
          userStake={userStake}
          isSelected={selectedOption === option.index}
          isOwnerSelected={ownerSelectedOption === option.index}
          isOwnerSelecting={isOwnerSelecting}
          isOwner={isOwner}
          onSelect={handleOptionSelect}
          isScrollable={isScrollable}
          hasUserParticipated={hasUserParticipated}
        />
      ))}

      {selectedOptionForStake && !hasUserParticipated && (
        <StakeModal
          isOpen={isStakeModalOpen}
          onOpenChange={setIsStakeModalOpen}
          optionTitle={selectedOptionForStake.title}
          onSubmit={(amount) => {
            if (onStakeSubmit && selectedOptionForStake?.index !== undefined) {
              onStakeSubmit(selectedOptionForStake.index, amount);
              setIsStakeModalOpen(false);
              setSelectedOptionForStake(null);
            }
          }}
          isLoading={isSubmitting}
          isOwner={isOwner}
        />
      )}
    </div>
  );
}
