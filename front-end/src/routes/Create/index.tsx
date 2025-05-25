import { useState } from "react";
import type { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/shadcn/ui/button";
import { ArrowLeft, Wallet } from "lucide-react";
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
import { motion } from "framer-motion";
import { Card, CardContent } from "@/shadcn/ui/card";

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

      await sleep(5000);

      const optionsForContract = data.options.map((option, index) => ({
        optionCount: index,
        description: option.description,
      }));

      const optionChunks = chunkArray(optionsForContract, 3);
      console.log(optionChunks);
      for (const optionChunk of optionChunks) {
        const createOptionsTx =
          await predictoryService.action.createEventOption(
            publicKey,
            eventId,
            optionChunk,
          );

        const createOptionsSimulations =
          await connection.simulateTransaction(createOptionsTx);
        console.log(createOptionsSimulations);
        const createOptionsTxHash = await sendTransaction(
          createOptionsTx,
          connection,
        );
        console.info("create options transaction hash", createOptionsTxHash);
        await sleep(2000);
      }
      await sleep(5000);

      navigate(APP_ROUTES.PREDICTORY_ID(eventId));
    } catch (error) {
      console.error("Error creating prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen relative z-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button variant="ghost" className="mb-8" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Predictions
          </Link>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-8 max-w-2xl mx-auto"
      >
        <Card className="backdrop-blur-sm bg-card/30 overflow-hidden rounded-xl border border-border">
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full p-2 bg-primary/20">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <span className="text-muted-foreground">Wallet Balance:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{balance} SOL</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <CreatePredictionForm
            onSubmit={handleCreatePrediction}
            isLoading={loading}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
