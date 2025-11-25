import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function DateTimePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  // INTERNAL DATE STATE (fixes re-render issues)
  const [current, setCurrent] = useState<Date>(new Date());

  // Sync external value → internal state
  useEffect(() => {
    if (value) {
      setCurrent(new Date(value));
    }
  }, [value]);

  const updateDate = (newDate: Date) => {
    setCurrent(newDate);
    onChange(newDate.toISOString());
  };

  const setDate = (date: Date) => {
    const updated = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      current.getHours(),
      current.getMinutes()
    );
    updateDate(updated);
  };

  const setTime = (hour: number, minute: number, ampm: "AM" | "PM") => {
    let h = hour;
    if (ampm === "PM" && hour !== 12) h += 12;
    if (ampm === "AM" && hour === 12) h = 0;

    const updated = new Date(current);
    updated.setHours(h);
    updated.setMinutes(minute);

    updateDate(updated);
  };

  const hour12 = (current.getHours() % 12) || 12;
  const minute = current.getMinutes();
  const ampm = current.getHours() >= 12 ? "PM" : "AM";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(current, "dd-MM-yyyy  hh:mm a")}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-4 space-y-3 w-80">
        <Calendar
          mode="single"
          selected={current}
          onSelect={(date) => date && setDate(date)}
        />

        {/* Time Selector */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />

          {/* Hours */}
          <select
            value={hour12}
            onChange={(e) =>
              setTime(Number(e.target.value), minute, ampm)
            }
            className="bg-black/20 px-2 py-1 rounded"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
          </select>

          {/* Minutes */}
          <select
            value={minute}
            onChange={(e) =>
              setTime(hour12, Number(e.target.value), ampm)
            }
            className="bg-black/20 px-2 py-1 rounded"
          >
            {Array.from({ length: 60 }).map((_, i) => (
              <option key={i} value={i}>
                {i.toString().padStart(2, "0")}
              </option>
            ))}
          </select>

          {/* AM/PM */}
          <select
            value={ampm}
            onChange={(e) =>
              setTime(hour12, minute, e.target.value as "AM" | "PM")
            }
            className="bg-black/20 px-2 py-1 rounded"
          >
            <option>AM</option>
            <option>PM</option>
          </select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
