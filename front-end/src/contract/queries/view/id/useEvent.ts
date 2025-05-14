import { useQuery } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";
import type { BN } from "@coral-xyz/anchor";

const useEvent = (eventId: BN) => {
  const { predictoryService } = usePredictoryService();
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      if (!predictoryService) return;
      const event = await predictoryService.view.event(eventId);
      return event;
    },
    enabled: !!predictoryService,
  });
};

export default useEvent;
