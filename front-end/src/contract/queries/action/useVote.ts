import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { sleep } from "@/utils";

const useVote = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const queryClient = useQueryClient();
  const { predictoryService } = usePredictoryService();

  return useMutation({
    mutationFn: async ({
      eventId,
      userVoteIndex,
      amount,
    }: {
      eventId: string;
      userVoteIndex: number;
      amount: number;
    }) => {
      if (!publicKey) throw new Error("PublicKey not found");
      if (!predictoryService) throw new Error("Predictory service not found");

      const authority = publicKey;
      const transaction = await predictoryService.action.vote(
        authority,
        eventId,
        userVoteIndex,
        amount,
      );

      const tx = await sendTransaction(transaction, connection);
      const simulation = await connection.simulateTransaction(transaction);
      console.log("simulation", simulation);
      return tx;
    },
    onSuccess: async (_, { eventId }) => {
      await sleep(1000);
      queryClient.invalidateQueries({ queryKey: ["allEvents"] });
      queryClient.invalidateQueries({
        queryKey: ["participant", publicKey?.toBase58(), eventId],
      });
      //TODO: or invalidate event
      // queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });
};

export default useVote;
