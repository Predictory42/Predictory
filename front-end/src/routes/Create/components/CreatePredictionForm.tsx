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
import { PlusCircle, Trash2, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/shadcn/ui/alert";
import { Separator } from "@/shadcn/ui/separator";
import { Badge } from "@/shadcn/ui/badge";
import { predictionFormSchema } from "./types";
import type { PredictionFormValues } from "./types";

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
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Create New Prediction
        </CardTitle>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6"
          >
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Prediction Details</h3>

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
                        className="min-h-[100px]"
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
                  <FormItem className="flex flex-row items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Private Prediction</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Prediction Options</h3>
                <Badge variant="outline" className="bg-secondary/10">
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
                              className="min-h-[60px]"
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
            </div>

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
