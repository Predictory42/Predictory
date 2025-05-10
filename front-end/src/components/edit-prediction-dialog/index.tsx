import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Label } from "@/shadcn/ui/label";
import { Input } from "@/shadcn/ui/input";
import type { AllEvents } from "@/types/predictory";
import { bufferToString } from "@/contract/utils";
import { useState } from "react";

type EditPredictionDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  prediction: AllEvents;
};

// TODO: Add a form to edit the name
// TODO: Add a form to edit the description
// TODO: Add a form to edit the options
// TODO: Add a form to edit the start date
// TODO: Add a form to edit the end date
// TODO: Add a form to edit the participation deadline

export const EditPredictionDialog = ({
  isOpen,
  onOpenChange,
  prediction,
}: EditPredictionDialogProps) => {
  const [predictionName, setPredictionName] = useState(
    prediction.name ? bufferToString(prediction.name) : "",
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Prediction</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="prediction-name">Name</Label>
            <Input id="prediction-name" defaultValue={predictionName} />
          </div>

          {prediction.result === -1 && (
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="datetime-local"
                defaultValue={new Date(prediction.endDate.toNumber())
                  .toISOString()
                  .slice(0, 16)}
              />
            </div>
          )}

          {prediction.result === -1 && (
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="result">Result</Label>
              <select
                id="result"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select winning option</option>
                {prediction.options.map((option, index) => (
                  <option key={index} value={index}>
                    {option.description
                      ? bufferToString(option.description)
                      : "-"}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => {
              console.log("Save changes");
              onOpenChange(false);
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
