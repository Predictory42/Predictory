import { useQuery } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";

const useEventOptions = () => {
  const { predictoryService } = usePredictoryService();
  return useQuery({
    queryKey: ["eventOptions"],
    queryFn: async () => {
      if (!predictoryService) return;
      const eventOptions = await predictoryService.view.eventsOptions();
      return eventOptions;
    },
    enabled: !!predictoryService,
  });
};

export default useEventOptions;
