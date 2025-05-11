import { useQuery } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";

const useEventsMeta = () => {
  const { predictoryService } = usePredictoryService();
  return useQuery({
    queryKey: ["eventsMeta"],
    queryFn: async () => {
      if (!predictoryService) return;
      const eventsMeta = await predictoryService.view.eventsMeta();
      return eventsMeta;
    },
    enabled: !!predictoryService,
  });
};

export default useEventsMeta;
