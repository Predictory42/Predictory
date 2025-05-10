import { useQuery } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";

const useUsers = () => {
  const { predictoryService } = usePredictoryService();
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      if (!predictoryService) return;
      const users = await predictoryService.view.users();
      return users;
    },
    enabled: !!predictoryService,
  });
};

export default useUsers;
