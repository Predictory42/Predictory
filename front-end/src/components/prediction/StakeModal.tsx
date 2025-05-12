import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@/shadcn/ui/label";
import { useWallet } from "@solana/wallet-adapter-react";
import { Alert, AlertDescription } from "@/shadcn/ui/alert";
import { AlertCircle } from "lucide-react";
import useBalance from "@/contract/queries/useBalance";

type StakeModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  optionTitle: string;
  onSubmit: (amount: number) => void;
  isLoading: boolean;
  isOwner?: boolean;
};

export function StakeModal({
  isOpen,
  onOpenChange,
  optionTitle,
  onSubmit,
  isLoading,
  isOwner = false,
}: StakeModalProps) {
  const [amount, setAmount] = useState("");
  const { connected } = useWallet();
  const { data: balance } = useBalance();

  const handleSubmit = () => {
    const stakeAmount = parseFloat(amount);
    if (stakeAmount > 0) {
      onSubmit(stakeAmount);
      setAmount("");
    }
  };

  // if (isOwner) {
  //   return (
  //     <Dialog open={isOpen} onOpenChange={onOpenChange}>
  //       <DialogContent>
  //         <DialogHeader>
  //           <DialogTitle>Cannot Participate</DialogTitle>
  //           <DialogDescription>
  //             As the event creator, you cannot participate in your own
  //             prediction event. You can only select the winning option after the
  //             event ends.
  //           </DialogDescription>
  //         </DialogHeader>
  //         <Button className="w-full" onClick={() => onOpenChange(false)}>
  //           Close
  //         </Button>
  //       </DialogContent>
  //     </Dialog>
  //   );
  // }

  const stakeAmount = parseFloat(amount);
  const hasInsufficientFunds = stakeAmount > (balance ?? 0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter your stake</DialogTitle>
          <DialogDescription>
            You are voting for:{" "}
            <span className="font-medium">{optionTitle}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="stake">Stake amount (SOL)</Label>
              <span className="text-sm text-muted-foreground">
                Balance: {balance?.toFixed(2)} SOL
              </span>
            </div>
            <Input
              id="stake"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount in SOL"
            />
          </div>

          {hasInsufficientFunds && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Insufficient funds. Your balance is {balance?.toFixed(2)} SOL
              </AlertDescription>
            </Alert>
          )}

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleSubmit}
            disabled={
              !amount ||
              stakeAmount <= 0 ||
              isLoading ||
              hasInsufficientFunds ||
              !connected
            }
            loading={isLoading}
          >
            Confirm Stake
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
