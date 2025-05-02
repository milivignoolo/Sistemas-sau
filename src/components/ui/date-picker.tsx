
"use client"

import * as React from "react"
import { format } from "date-fns"
import { es } from 'date-fns/locale' // Import Spanish locale
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    value?: Date;
    onSelect: (date: Date | undefined) => void;
    placeholder?: string;
    className?: string;
    disabled?: (date: Date) => boolean;
}

export function DatePicker({ value, onSelect, placeholder = "Selecciona una fecha", className, disabled }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP", { locale: es }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onSelect}
          initialFocus
          locale={es} // Set locale to Spanish
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  )
}
