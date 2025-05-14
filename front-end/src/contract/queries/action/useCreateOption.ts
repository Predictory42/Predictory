import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { chunkArray } from "@/utils";

const useCreateOption = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const queryClient = useQueryClient();
  const { predictoryService } = usePredictoryService();

  return useMutation({
    mutationFn: async ({
      eventId,
      options,
    }: {
      eventId: string;
      options: { optionCount: number; description: string }[];
    }) => {
      if (!publicKey) throw new Error("PublicKey not found");
      if (!predictoryService) throw new Error("Predictory service not found");
      const hashes: string[] = [];
      const optionChunks = chunkArray(options, 3);

      for (const optionChunk of optionChunks) {
        const createOptionsTx =
          await predictoryService.action.createEventOption(
            publicKey,
            eventId,
            optionChunk,
          );

        const createOptionsTxHash = await sendTransaction(
          createOptionsTx,
          connection,
        );

        console.info("create options transaction hash", createOptionsTxHash);
        hashes.push(createOptionsTxHash);
      }
      return hashes;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allEvents"] });
    },
  });
};

export default useCreateOption;
