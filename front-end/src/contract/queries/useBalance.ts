import { useQuery } from "@tanstack/react-query";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const useBalance = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  return useQuery({
    queryKey: ["balance", publicKey],
    queryFn: async () => {
      if (!publicKey) return;
      const bal = await connection.getBalance(publicKey);
      return bal / LAMPORTS_PER_SOL;
    },
    enabled: !!publicKey,
  });
};

export default useBalance;
