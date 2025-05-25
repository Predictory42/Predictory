import { useState } from "react";
import type { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { Switch } from "@/shadcn/ui/switch";
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { DateForm } from "@/components/form/DateForm";
import {
  PlusCircle,
  Trash2,
  AlertCircle,
  Sparkles,
  ListPlus,
  Lock,
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/shadcn/ui/alert";
import { Separator } from "@/shadcn/ui/separator";
import { Badge } from "@/shadcn/ui/badge";
import { predictionFormSchema } from "./types";
import type { PredictionFormValues } from "./types";
import { motion } from "framer-motion";

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 20;

interface CreatePredictionFormProps {
  onSubmit: (data: PredictionFormValues) => Promise<void>;
  isLoading: boolean;
}

export const CreatePredictionForm: FC<CreatePredictionFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const { publicKey } = useWallet();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<PredictionFormValues>({
    resolver: zodResolver(predictionFormSchema),
    defaultValues: {
      name: "",
      description: "",
      isPrivate: false,
      options: [{ description: "" }, { description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const handleFormSubmit = async (data: PredictionFormValues) => {
    try {
      setError(null);
      await onSubmit(data);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Failed to create prediction. Please try again.");
    }
  };

  const addOption = () => {
    if (fields.length < MAX_OPTIONS) {
      append({ description: "" });
    }
  };

  const removeOption = (index: number) => {
    if (fields.length > MIN_OPTIONS) {
      remove(index);
    }
  };

  return (
    <Card className="bg-popover/30 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold font-cinzel bg-gradient-to-r from-primary via-accent to-chart-1 bg-clip-text text-transparent flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Create New Prediction
        </CardTitle>
      </CardHeader>
      <Separator />

      <CardContent className="pt-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert
              variant="destructive"
              className="mb-6 border border-destructive/50"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="rounded-full p-1.5 bg-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
              </span>
              Prediction Details
            </h3>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prediction Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter prediction name (max 32 characters)"
                      {...field}
                      maxLength={32}
                      className="bg-background/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your prediction (max 256 characters)"
                      className="min-h-[100px] bg-background/50"
                      {...field}
                      maxLength={256}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DateForm
                name="startDate"
                control={form.control}
                label="Start Date"
              />

              <DateForm
                name="endDate"
                control={form.control}
                label="End Date"
              />

              <DateForm
                name="participationDeadline"
                control={form.control}
                label="Participation Deadline (Optional)"
              />
            </div>

            <FormField
              control={form.control}
              name="isPrivate"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 p-3 rounded-lg border border-border bg-background/20">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-amber-500" />
                    Private Prediction
                  </FormLabel>
                </FormItem>
              )}
            />

            <Separator />

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="rounded-full p-1.5 bg-accent/20">
                  <ListPlus className="w-4 h-4 text-accent" />
                </span>
                Prediction Options
              </h3>
              <Badge
                variant="outline"
                className="bg-accent/10 border-accent text-accent"
              >
                {fields.length} / {MAX_OPTIONS} options
              </Badge>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <FormField
                    control={form.control}
                    name={`options.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Textarea
                            placeholder={`Option ${index + 1} description (max 256 characters)`}
                            className="min-h-[60px] bg-background/50"
                            {...field}
                            maxLength={256}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                    disabled={fields.length <= MIN_OPTIONS}
                    className="mt-1"
                  >
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={addOption}
              disabled={fields.length >= MAX_OPTIONS}
              className="w-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Option
            </Button>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !publicKey}
            >
              {isLoading ? "Creating..." : "Create Prediction"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
