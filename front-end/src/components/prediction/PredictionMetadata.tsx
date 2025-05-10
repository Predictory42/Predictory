import { Badge } from "@/shadcn/ui/badge";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

type PredictionMetadataProps = {
  poolSize: number;
  optionsCount?: number;
  resultTitle?: string;
  onCancelResult?: () => void;
  showCancelOption?: boolean;
};

export function PredictionMetadata({
  poolSize,
  optionsCount,
  resultTitle,
  onCancelResult,
  showCancelOption = false,
}: PredictionMetadataProps) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Pool Size:</span>
        <span>{(poolSize / LAMPORTS_PER_SOL).toFixed(2)} SOL</span>
      </div>

      {optionsCount !== undefined && (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Options:</span>
          <span>{optionsCount}</span>
        </div>
      )}

      {resultTitle && (
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Result:</span>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary"
            >
              {resultTitle}
            </Badge>

            {showCancelOption && onCancelResult && (
              <button
                onClick={onCancelResult}
                className="h-6 w-6 rounded-full flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
