import { useState } from "react";
import type { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/shadcn/ui/button";
import { ArrowLeft } from "lucide-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Link, useNavigate } from "react-router";
import useBalance from "@/contract/queries/useBalance";
import { usePredictoryService } from "@/providers/PredictoryService";
import { v4 as uuidv4 } from "uuid";
import { CreatePredictionForm } from "./components/CreatePredictionForm";
import type { PredictionFormValues } from "./components/types";
import { APP_ROUTES } from "../constants";
import useContractState from "@/contract/queries/view/id/useContractState";
import { chunkArray, sleep } from "@/utils";

export const Create: FC = () => {
  const navigate = useNavigate();
  const { publicKey, sendTransaction } = useWallet();
  const { data: balance } = useBalance();
  const { data: contractState } = useContractState();
  const { predictoryService } = usePredictoryService();
  const { connection } = useConnection();

  const [loading, setLoading] = useState(false);

  const handleCreatePrediction = async (data: PredictionFormValues) => {
    if (!publicKey || !predictoryService || !contractState) return;

    setLoading(true);
    try {
      const eventId = uuidv4();
      console.info("eventId", eventId);
      const args = {
        name: data.name,
        description: data.description,
        startDate: data.startDate.getTime(),
        endDate: data.endDate.getTime(),
        participationDeadline: data.participationDeadline
          ? data.participationDeadline.getTime()
          : null,
        isPrivate: data.isPrivate,
      };

      const createEventTx = await predictoryService.action.createEvent(
        publicKey,
        eventId,
        contractState.eventPrice,
        args,
      );

      const simulations = await connection.simulateTransaction(createEventTx);
      console.log(simulations);
      const createEventTxHash = await sendTransaction(
        createEventTx,
        connection,
      );
      console.info("create event transaction hash", createEventTxHash);

      await sleep(2000);

      const optionsForContract = data.options.map((option, index) => ({
        optionCount: index,
        description: option.description,
      }));

      const optionChunks = chunkArray(optionsForContract, 3);

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
      }
      await sleep(2000);

      navigate(APP_ROUTES.PREDICTORY_ID(eventId));
    } catch (error) {
      console.error("Error creating prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button variant="ghost" className="mb-8" asChild>
        <Link to="/" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Predictions
        </Link>
      </Button>

      <div className="flex flex-col gap-8 max-w-2xl mx-auto">
        <div className="p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <span>Wallet Balance:</span>
            <span className="text-xl font-bold">{balance} SOL</span>
          </div>
        </div>

        <CreatePredictionForm
          onSubmit={handleCreatePrediction}
          isLoading={loading}
        />
      </div>
    </div>
  );
};
