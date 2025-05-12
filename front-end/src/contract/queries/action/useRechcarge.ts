import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { sleep } from "@/utils";

const useRecharge = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const queryClient = useQueryClient();
  const { predictoryService } = usePredictoryService();

  return useMutation({
    mutationFn: async ({ eventId }: { eventId: string }) => {
      if (!publicKey) throw new Error("PublicKey not found");
      if (!predictoryService) throw new Error("Predictory service not found");

      const transaction = await predictoryService.action.recharge(
        publicKey,
        eventId,
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
        queryKey: ["balance", publicKey?.toBase58()],
      });
      //TODO: or invalidate event
      // queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });
};

export default useRecharge;
