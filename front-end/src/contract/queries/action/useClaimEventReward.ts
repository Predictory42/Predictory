import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { sleep } from "@/utils";

const useClaimEventReward = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const queryClient = useQueryClient();
  const { predictoryService } = usePredictoryService();

  return useMutation({
    mutationFn: async ({
      eventId,
      optionIndex,
    }: {
      eventId: string;
      optionIndex: number;
    }) => {
      if (!publicKey) throw new Error("PublicKey not found");
      if (!predictoryService) throw new Error("Predictory service not found");

      const contractAdminKey = await predictoryService.view.state();
      const transaction = await predictoryService.action.claimEventReward(
        publicKey,
        eventId,
        optionIndex,
        contractAdminKey.authority,
      );
      const tx = await sendTransaction(transaction, connection);
      const simulation = await connection.simulateTransaction(transaction);
      console.log("simulation", simulation);
      return tx;
    },
    onSuccess: async () => {
      await sleep(1000);
      queryClient.invalidateQueries({ queryKey: ["allEvents"] });
      queryClient.invalidateQueries({
        queryKey: ["participant", publicKey?.toBase58()],
      });
      //TODO: or invalidate event
      // queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });
};

export default useClaimEventReward;
