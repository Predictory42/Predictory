import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePredictoryService } from "@/providers/PredictoryService";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { chunkArray } from "@/utils";

const useUpdateEventOption = () => {
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
      options: { optionIndex: number; description: string }[];
    }) => {
      if (!publicKey) throw new Error("PublicKey not found");
      if (!predictoryService) throw new Error("Predictory service not found");
      const hashes: string[] = [];
      const optionChunks = chunkArray(options, 3);

      for (const optionChunk of optionChunks) {
        const updateOptionsTx =
          await predictoryService.action.updateEventOption(
            publicKey,
            eventId,
            optionChunk,
          );

        const updateOptionsTxHash = await sendTransaction(
          updateOptionsTx,
          connection,
        );

        console.info("update options transaction hash", updateOptionsTxHash);
        hashes.push(updateOptionsTxHash);
      }
      return hashes;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allEvents"] });
      //TODO: or invalidate event
      // queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
  });
};

export default useUpdateEventOption;
