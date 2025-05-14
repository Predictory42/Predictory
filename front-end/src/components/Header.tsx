import { Button } from "@/shadcn/ui/button";
import { Plus } from "lucide-react";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { Link, useNavigate } from "react-router";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between gap-4 mb-8 backdrop-blur-sm bg-popover/30 p-4 rounded-2xl border border-white/10">
      <Link to="/" className="flex items-center gap-3 group">
        <img
          src="/predictory.webp"
          alt="Predictory"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full group-hover:scale-110 transition-transform"
        />
        <h1 className="hidden sm:block text-2xl md:text-4xl font-cinzel font-bold">
          Predictory
        </h1>
      </Link>

      <div className="flex items-center gap-3">
        <ConnectWalletButton />
        <Button onClick={() => navigate("/create")}>
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">Create Prediction</span>
        </Button>
      </div>
    </header>
  );
};
