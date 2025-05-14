import { useQuery } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";
import type { BN } from "@coral-xyz/anchor";

const useEventOption = (eventId: BN) => {
  const { predictoryService } = usePredictoryService();
  return useQuery({
    queryKey: ["eventOption", eventId],
    queryFn: async () => {
      if (!predictoryService) return;
      const eventOption = await predictoryService.view.eventOption(eventId);
      return eventOption;
    },
    enabled: !!predictoryService,
  });
};

export default useEventOption;
