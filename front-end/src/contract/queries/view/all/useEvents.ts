import { useQuery } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";

const useEvents = () => {
  const { predictoryService } = usePredictoryService();
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      if (!predictoryService) return;
      const events = await predictoryService.view.allEvents();
      return events;
    },
    enabled: !!predictoryService,
  });
};

export default useEvents;
