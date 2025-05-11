import { useQuery } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";

const useUser = (userId: string) => {
  const { predictoryService } = usePredictoryService();
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!predictoryService) return;
      const user = await predictoryService.view.user(userId);
      return user;
    },
    enabled: !!predictoryService && !!userId,
  });
};

export default useUser;
