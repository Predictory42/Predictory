import { Button } from "@/shadcn/ui/button";
import { cn } from "@/shadcn/utils";
import { truncateAddress } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal, WalletIcon } from "@solana/wallet-adapter-react-ui";
import { Link } from "react-router";

export function ConnectWalletButton({ className }: { className?: string }) {
  const { wallet, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnect = () => {
    setVisible(true);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {publicKey ? (
        <Button variant="outline" asChild>
          <Link to={`/profile/${publicKey.toString()}`}>
            <WalletIcon wallet={wallet} className="w-4 h-4" />
            {truncateAddress(publicKey.toString())}
          </Link>
        </Button>
      ) : (
        <Button variant="secondary" onClick={handleConnect}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
}
