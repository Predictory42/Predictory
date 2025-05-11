import { useQuery } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";
import type { BN } from "@coral-xyz/anchor";

const useEventMeta = (eventId: BN) => {
  const { predictoryService } = usePredictoryService();
  return useQuery({
    queryKey: ["eventMeta", eventId],
    queryFn: async () => {
      if (!predictoryService) return;
      const eventMeta = await predictoryService.view.eventMeta(eventId);
      return eventMeta;
    },
    enabled: !!predictoryService,
  });
};

export default useEventMeta;
