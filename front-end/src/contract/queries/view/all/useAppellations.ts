import { useQuery } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";

const useAppellations = () => {
  const { predictoryService } = usePredictoryService();
  return useQuery({
    queryKey: ["appellations"],
    queryFn: async () => {
      if (!predictoryService) return;
      const appellations = await predictoryService.view.appellations();
      return appellations;
    },
    enabled: !!predictoryService,
  });
};

export default useAppellations;
