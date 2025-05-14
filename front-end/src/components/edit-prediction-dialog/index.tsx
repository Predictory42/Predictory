import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shadcn/ui/dialog";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Textarea } from "@/shadcn/ui/textarea";
import { DateForm } from "@/components/form/DateForm";
import type { AllEvents } from "@/types/predictory";
import { bufferToString } from "@/contract/utils";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import { PlusCircle, Trash2, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/shadcn/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import useUpdateEventName from "@/contract/queries/action/useUpdateEventName";
import useUpdateEventDescription from "@/contract/queries/action/useUpdateEventDescription";
import useUpdateEventEndDate from "@/contract/queries/action/useUpdateEventEndDate";
import useUpdateEventOption from "@/contract/queries/action/useUpdateEventOption";
import useUpdateEventParticipationDeadline from "@/contract/queries/action/useUpdateEventParticipationDeadline";

type EditPredictionDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  prediction: AllEvents;
};

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 20;

const nameFormSchema = z.object({
  name: z.string().min(1).max(32),
});

const descriptionFormSchema = z.object({
  description: z.string().min(1).max(256),
});

const endDateFormSchema = z.object({
  endDate: z.date(),
});

const participationDeadlineFormSchema = z.object({
  participationDeadline: z.date().optional(),
});

const optionSchema = z.object({
  description: z.string().min(1, "Description is required").max(256),
  optionIndex: z.number(),
});

const optionsFormSchema = z.object({
  options: z.array(optionSchema).min(MIN_OPTIONS),
});

type EditFormTabs =
  | "name"
  | "description"
  | "endDate"
  | "participationDeadline"
  | "options";

export const EditPredictionDialog = ({
  isOpen,
  onOpenChange,
  prediction,
}: EditPredictionDialogProps) => {
  const [activeTab, setActiveTab] = useState<EditFormTabs>("name");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const updateEventName = useUpdateEventName();
  const updateEventDescription = useUpdateEventDescription();
  const updateEventEndDate = useUpdateEventEndDate();
  const updateEventOption = useUpdateEventOption();
  const updateEventParticipationDeadline =
    useUpdateEventParticipationDeadline();

  const nameForm = useForm<z.infer<typeof nameFormSchema>>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: {
      name: prediction.name ? bufferToString(prediction.name) : "",
    },
  });

  const descriptionForm = useForm<z.infer<typeof descriptionFormSchema>>({
    resolver: zodResolver(descriptionFormSchema),
    defaultValues: {
      description: prediction.description
        ? bufferToString(prediction.description)
        : "",
    },
  });

  const endDateForm = useForm<z.infer<typeof endDateFormSchema>>({
    resolver: zodResolver(endDateFormSchema),
    defaultValues: {
      endDate: new Date(prediction.endDate.toNumber()),
    },
  });

  const participationDeadlineForm = useForm<
    z.infer<typeof participationDeadlineFormSchema>
  >({
    resolver: zodResolver(participationDeadlineFormSchema),
    defaultValues: {
      participationDeadline: prediction.participationDeadline
        ? new Date(prediction.participationDeadline.toNumber())
        : undefined,
    },
  });

  const optionsForm = useForm<z.infer<typeof optionsFormSchema>>({
    resolver: zodResolver(optionsFormSchema),
    defaultValues: {
      options: prediction.options.map((option, index) => ({
        description: option.description
          ? bufferToString(option.description)
          : "",
        optionIndex: index,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: optionsForm.control,
    name: "options",
  });

  const addOption = () => {
    if (fields.length < MAX_OPTIONS) {
      append({ description: "", optionIndex: fields.length });
    }
  };

  const removeOption = (index: number) => {
    if (fields.length > MIN_OPTIONS) {
      remove(index);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      let nameValues;
      let descriptionValues;
      let endDateValues;
      let participationDeadlineValues;
      let optionsValues;

      switch (activeTab) {
        case "name":
          nameValues = nameForm.getValues();
          await updateEventName.mutateAsync({
            eventId: prediction.id.toString(),
            name: nameValues.name,
          });
          break;

        case "description":
          descriptionValues = descriptionForm.getValues();
          await updateEventDescription.mutateAsync({
            eventId: prediction.id.toString(),
            description: descriptionValues.description,
          });
          break;

        case "endDate":
          endDateValues = endDateForm.getValues();
          await updateEventEndDate.mutateAsync({
            eventId: prediction.id.toString(),
            endDate: endDateValues.endDate.getTime(),
          });
          break;

        case "participationDeadline":
          participationDeadlineValues = participationDeadlineForm.getValues();
          if (participationDeadlineValues.participationDeadline) {
            await updateEventParticipationDeadline.mutateAsync({
              eventId: prediction.id.toString(),
              participationDeadline:
                participationDeadlineValues.participationDeadline.getTime(),
            });
          }
          break;

        case "options":
          optionsValues = optionsForm.getValues();
          await updateEventOption.mutateAsync({
            eventId: prediction.id.toString(),
            options: optionsValues.options.map((option) => ({
              optionIndex: option.optionIndex,
              description: option.description,
            })),
          });
          break;
      }

      onOpenChange(false);
    } catch (err) {
      console.error("Error updating prediction:", err);
      setError("Failed to update prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Prediction</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as EditFormTabs)}
        >
          <TabsList className="grid grid-cols-2 gap-2 md:gap-0 md:grid-cols-5 w-full h-fit bg-transparent">
            <TabsTrigger className="bg-muted md:bg-transparent" value="name">
              Name
            </TabsTrigger>
            <TabsTrigger
              className="bg-muted md:bg-transparent"
              value="description"
            >
              Description
            </TabsTrigger>
            <TabsTrigger className="bg-muted md:bg-transparent" value="endDate">
              End Date
            </TabsTrigger>
            <TabsTrigger
              className="bg-muted md:bg-transparent"
              value="participationDeadline"
            >
              Deadline
            </TabsTrigger>
            <TabsTrigger className="bg-muted md:bg-transparent" value="options">
              Options
            </TabsTrigger>
          </TabsList>

          {/* Name Form */}
          <TabsContent value="name">
            <Form {...nameForm}>
              <form className="space-y-4">
                <FormField
                  control={nameForm.control}
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
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="description">
            <Form {...descriptionForm}>
              <form className="space-y-4">
                <FormField
                  control={descriptionForm.control}
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
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="endDate">
            <Form {...endDateForm}>
              <form className="space-y-4">
                <DateForm
                  name="endDate"
                  control={endDateForm.control}
                  label="End Date"
                />
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="participationDeadline">
            <Form {...participationDeadlineForm}>
              <form className="space-y-4">
                <DateForm
                  name="participationDeadline"
                  control={participationDeadlineForm.control}
                  label="Participation Deadline"
                />
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="options">
            <Form {...optionsForm}>
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[300px]">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-2">
                      <FormField
                        control={optionsForm.control}
                        name={`options.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="flex-grow">
                            <FormLabel>Option {index + 1}</FormLabel>
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
                        className="mt-8"
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
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
