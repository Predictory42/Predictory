import { useQuery } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";

const useAllEvents = () => {
  const { predictoryService } = usePredictoryService();
  return useQuery({
    queryKey: ["allEvents"],
    queryFn: async () => {
      if (!predictoryService) return;
      const allEvents = await predictoryService.view.allEvents();
      return allEvents;
    },
    enabled: !!predictoryService,
  });
};

export default useAllEvents;
