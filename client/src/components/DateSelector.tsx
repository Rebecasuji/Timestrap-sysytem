import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DateSelectorProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

// Ensure Neon-safe date (no timezone shift)
function normalizeDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default function DateSelector({
  selectedDate,
  setSelectedDate,
}: DateSelectorProps) {

  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-start text-left font-normal bg-black/30 border-blue-500/40 hover:border-blue-500 hover:bg-black/50 transition-all"
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-blue-400" />
          <span className="font-mono">
            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-0 bg-card/95 backdrop-blur-xl border-blue-500/30"
        align="start"
      >
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) {
              const fixed = normalizeDate(date); // Fix timezone issues
              setSelectedDate(fixed);
            }
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
