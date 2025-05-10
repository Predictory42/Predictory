import { useQuery } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";

const useAppeals = () => {
  const { predictoryService } = usePredictoryService();
  return useQuery({
    queryKey: ["appeals"],
    queryFn: async () => {
      if (!predictoryService) return;
      const appeals = await predictoryService.view.appeals();
      return appeals;
    },
    enabled: !!predictoryService,
  });
};

export default useAppeals;
