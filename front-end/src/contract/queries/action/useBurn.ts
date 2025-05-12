import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { sleep } from "@/utils";

const useBurn = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const queryClient = useQueryClient();
  const { predictoryService } = usePredictoryService();

  return useMutation({
    mutationFn: async ({ eventId }: { eventId: string }) => {
      if (!publicKey) throw new Error("PublicKey not found");
      if (!predictoryService) throw new Error("Predictory service not found");

      const authority = publicKey;
      const transaction = await predictoryService.action.burn(
        authority,
        eventId,
      );
      const tx = await sendTransaction(transaction, connection);
      return tx;
    },
    onSuccess: async () => {
      await sleep(1000);
      queryClient.invalidateQueries({
        queryKey: ["user", publicKey?.toBase58()],
      });
    },
  });
};

export default useBurn;
