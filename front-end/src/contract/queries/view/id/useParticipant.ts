import { useQuery } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";
import type { BN } from "@coral-xyz/anchor";

const useParticipant = (participantId: string, eventId: BN | undefined) => {
  const { predictoryService } = usePredictoryService();
  return useQuery({
    queryKey: ["participant", participantId, eventId],
    queryFn: async () => {
      if (!predictoryService || !participantId || !eventId) return;
      const participant = await predictoryService.view.participant(
        participantId,
        eventId,
      );
      return participant;
    },
    enabled: !!predictoryService && !!participantId && !!eventId,
  });
};

export default useParticipant;
