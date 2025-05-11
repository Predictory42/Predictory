import useUser from "@/contract/queries/view/id/useUser";
import { UserRegistrationModal } from "@/components/UserRegistrationModal";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

export const FetchUserComponent = () => {
  const { publicKey } = useWallet();
  const { data: user, isLoading } = useUser(publicKey?.toBase58() || "");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  useEffect(() => {
    if (publicKey && !user && !isLoading) {
      setShowRegistrationModal(true);
    }
  }, [publicKey, user, isLoading]);

  return (
    <UserRegistrationModal
      isOpen={showRegistrationModal}
      onClose={() => setShowRegistrationModal(false)}
    />
  );
};
