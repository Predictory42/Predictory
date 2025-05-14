import { ExternalLink, Star } from "lucide-react";
import { Link } from "react-router";
import { truncateAddress } from "@/utils";
import { APP_ROUTES } from "@/routes/constants";

type PredictionCreatorInfoProps = {
  address: string;
  rating?: number;
};

// Mock creator rating function if no rating is provided
function getCreatorRating(address: string): number {
  const hash = Array.from(address).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0,
  );
  return 3 + (hash % 200) / 100; // Rating between 3.0 and 5.0
}

export function PredictionCreatorInfo({
  address,
  rating,
}: PredictionCreatorInfoProps) {
  const creatorRating = rating ?? getCreatorRating(address);

  return (
    <div className="flex items-center gap-2">
      <Link
        to={APP_ROUTES.PROFILE(address)}
        className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
      >
        {truncateAddress(address)}
        <ExternalLink size={14} />
      </Link>

      <div className="flex items-center text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
        <Star className="h-3 w-3 fill-amber-500 mr-0.5" />
        <span className="text-xs font-medium">{creatorRating.toFixed(1)}</span>
      </div>
    </div>
  );
}
