import { useState } from "react";
import type { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/shadcn/ui/button";
import { ArrowLeft } from "lucide-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Link, useNavigate } from "react-router";
import useBalance from "@/contract/queries/useBalance";
import { usePredictoryService } from "@/providers/PredictoryService";
import useUser from "@/contract/queries/view/id/useUser";
import { v4 as uuidv4 } from "uuid";
import { UserRegistrationForm } from "./components/UserRegistrationForm";
import { CreatePredictionForm } from "./components/CreatePredictionForm";
import type { PredictionFormValues } from "./components/types";
import { APP_ROUTES } from "../constants";

export const Create: FC = () => {
  const navigate = useNavigate();
  const { publicKey, sendTransaction } = useWallet();
  const { data: balance } = useBalance();
  const { data: user } = useUser(publicKey?.toBase58() || "");
  const { predictoryService } = usePredictoryService();
  const { connection } = useConnection();

  const [loading, setLoading] = useState(false);

  const handleCreatePrediction = async (data: PredictionFormValues) => {
    if (!publicKey || !predictoryService) return;

    setLoading(true);
    try {
      const eventId = uuidv4();
      console.info("eventId", eventId);

      //TODO: add stake from state contract useStateContract
      const stake = 0.1 * LAMPORTS_PER_SOL;

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
        stake,
        args,
      );

      const optionsForContract = data.options.map((option, index) => ({
        optionCount: index,
        description: option.description,
      }));

      const createOptionsTx = await predictoryService.action.createEventOption(
        publicKey,
        eventId,
        optionsForContract,
      );

      const createEventTxHash = await sendTransaction(
        createEventTx.add(createOptionsTx),
        connection,
      );
      console.info("create event transaction hash", createEventTxHash);

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

        {!user && <UserRegistrationForm />}
        <div className="relative">
          {!user && (
            <div className="absolute top-0 left-0 rounded-xl inset-0 bg-black/50 z-10 flex items-center justify-center custom-blur">
              To continue, create a user.
            </div>
          )}
        </div>
        <CreatePredictionForm
          onSubmit={handleCreatePrediction}
          isLoading={loading}
        />
      </div>
    </div>
  );
};
