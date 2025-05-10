import { useQuery } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";

const useParticipant = (participantId: string) => {
  const { predictoryService } = usePredictoryService();
  return useQuery({
    queryKey: ["participant", participantId],
    queryFn: async () => {
      if (!predictoryService) return;
      const participant =
        await predictoryService.view.participant(participantId);
      return participant;
    },
    enabled: !!predictoryService,
  });
};

export default useParticipant;
