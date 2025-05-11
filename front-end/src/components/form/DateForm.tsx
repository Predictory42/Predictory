import { DateTimePicker } from "@/shadcn/ui/calendar";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shadcn/ui/form";
import type { UseControllerProps } from "react-hook-form";
import type { Control } from "react-hook-form";

type Props<T extends object> = {
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
          <FormControl>
            <DateTimePicker
              value={field.value}
              onChange={(date) => {
                field.onChange(date);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
