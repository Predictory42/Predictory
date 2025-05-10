import { useQuery } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";
import type { BN } from "@coral-xyz/anchor";

const useAppeal = (appealId: BN) => {
  const { predictoryService } = usePredictoryService();
  return useQuery({
    queryKey: ["appeal", appealId],
    queryFn: async () => {
      if (!predictoryService) return;
      const appeal = await predictoryService.view.appeal(appealId);
      return appeal;
    },
    enabled: !!predictoryService,
  });
};

export default useAppeal;
