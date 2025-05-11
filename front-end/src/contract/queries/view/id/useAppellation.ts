import { useQuery } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";
import type { BN } from "@coral-xyz/anchor";

const useAppellation = (appellationId: BN) => {
  const { predictoryService } = usePredictoryService();
  return useQuery({
    queryKey: ["appellation", appellationId],
    queryFn: async () => {
      if (!predictoryService) return;
      const appellation =
        await predictoryService.view.appellation(appellationId);
      return appellation;
    },
    enabled: !!predictoryService,
  });
};

export default useAppellation;
