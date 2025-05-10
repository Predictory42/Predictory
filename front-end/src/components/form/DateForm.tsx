import { Calendar } from "@/shadcn/ui/calendar";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shadcn/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { cn } from "@/shadcn/utils";
import { CalendarIcon } from "lucide-react";
import type { UseControllerProps } from "react-hook-form";
import type { InputProps } from "react-day-picker";
import type { Control } from "react-hook-form";
import { Button } from "@/shadcn/ui/button";
import { format } from "date-fns";

type Props<T extends object> = InputProps & {
  name: UseControllerProps<T>["name"];
  control: Control<T>;
  label?: string;
};

export const DateForm = <T extends object>({
  name,
  control,
  label,
}: Props<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal hover:bg-muted",
                    !field.value && "text-muted-foreground",
                  )}
                  type="button"
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Select {label}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
