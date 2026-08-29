"use client";

import { useState, type ComponentProps } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const toDateValue = (value?: string) => {
  if (!value) return undefined;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const toDateString = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const formatDisplay = (value?: string) => {
  const date = toDateValue(value);
  if (!date) return null;
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
};

type DatePickerProps = {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  calendarDisabled?: ComponentProps<typeof Calendar>["disabled"];
  className?: string;
  portalContainer?: HTMLElement | null;
};

const DatePicker = ({
  id,
  name,
  value,
  defaultValue,
  onChange,
  placeholder = "Pick a date",
  disabled,
  calendarDisabled,
  className,
  portalContainer,
}: DatePickerProps) => {
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const currentValue = isControlled ? value : uncontrolledValue;

  const handleSelect = (date: Date | undefined) => {
    const next = date ? toDateString(date) : "";

    if (!isControlled) {
      setUncontrolledValue(next);
    }

    onChange?.(next);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          id={id}
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !currentValue && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon />
          {formatDisplay(currentValue) || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
        container={portalContainer ?? undefined}
      >
        <Calendar
          mode="single"
          selected={toDateValue(currentValue)}
          onSelect={handleSelect}
          disabled={calendarDisabled}
          autoFocus
        />
      </PopoverContent>
      {name ? (
        <input type="hidden" name={name} value={currentValue} readOnly />
      ) : null}
    </Popover>
  );
};

export default DatePicker;
