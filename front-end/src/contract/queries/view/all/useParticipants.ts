import { useQuery } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";

const useParticipants = () => {
  const { predictoryService } = usePredictoryService();
  return useQuery({
    queryKey: ["participants"],
    queryFn: async () => {
      if (!predictoryService) return;
      const participants = await predictoryService.view.participants();
      return participants;
    },
    enabled: !!predictoryService,
  });
};

export default useParticipants;
