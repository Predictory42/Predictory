import { useState } from "react";
import type { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePredictoryService } from "@/providers/PredictoryService";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shadcn/ui/dialog";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/shadcn/ui/alert";
import { useQueryClient } from "@tanstack/react-query";
import { userRegistrationFormSchema } from "../routes/Create/components/types";
import { sleep } from "@/utils";

interface UserRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserRegistrationModal: FC<UserRegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const { publicKey, sendTransaction, disconnect } = useWallet();
  const { connection } = useConnection();
  const { predictoryService } = usePredictoryService();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof userRegistrationFormSchema>>({
    resolver: zodResolver(userRegistrationFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleClose = () => {
    disconnect();
    onClose();
  };

  const onSubmit = async (data: z.infer<typeof userRegistrationFormSchema>) => {
    if (!publicKey || !predictoryService) return;

    setLoading(true);
    setError(null);

    try {
      const tx = await predictoryService.action.createUser(
        publicKey,
        data.name,
      );

      const userCreationTx = await sendTransaction(tx, connection);
      console.info("userCreationTx", userCreationTx);

      await sleep(5000);
      queryClient.invalidateQueries({
        queryKey: ["user", publicKey.toBase58()],
      });
      onClose();
    } catch (error) {
      console.error("Error creating user:", error);
      setError("Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create Your Predictor Profile
          </DialogTitle>
          <DialogDescription>
            Before creating predictions, you need to set up your profile
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name (max 32 characters)"
                      {...field}
                      maxLength={32}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !publicKey}
            >
              {loading ? "Creating Profile..." : "Create Profile"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
