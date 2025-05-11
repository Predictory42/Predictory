import { PredictoryService } from "@/contract/predictory";
import type NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

interface PredictoryServiceContextType {
  predictoryService: PredictoryService | null;
}

const PredictoryServiceContext = createContext<
  PredictoryServiceContextType | undefined
>(undefined);

export function PredictoryServiceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { connection } = useConnection();
  const { wallet } = useWallet();
  const [predictoryService, setPredictoryService] =
    useState<PredictoryService | null>(null);

  useEffect(() => {
    if (!connection) return;
    setPredictoryService(
      new PredictoryService(connection, wallet as unknown as NodeWallet),
    );
  }, [connection, wallet]);

  const value = useMemo(
    () => ({
      predictoryService,
    }),
    [predictoryService],
  );

  return (
    <PredictoryServiceContext.Provider value={value}>
      {children}
    </PredictoryServiceContext.Provider>
  );
}

export function usePredictoryService() {
  const context = useContext(PredictoryServiceContext);

  if (context === undefined) {
    throw new Error(
      "usePredictoryService must be used within a PredictoryServiceProvider",
    );
  }

  return context;
}
