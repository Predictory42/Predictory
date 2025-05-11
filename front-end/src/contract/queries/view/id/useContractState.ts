import { useQuery } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";

const useContractState = () => {
  const { predictoryService } = usePredictoryService();
  return useQuery({
    queryKey: ["contractState"],
    queryFn: async () => {
      if (!predictoryService) return;
      const contractState = await predictoryService.view.state();
      return contractState;
    },
    enabled: !!predictoryService,
  });
};

export default useContractState;
