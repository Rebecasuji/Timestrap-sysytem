import { Button } from '@/components/ui/button';

type ShiftType = '4hr' | '8hr' | '12hr';

interface ShiftSelectorProps {
  selectedShift: ShiftType;
  onShiftChange: (shift: ShiftType) => void;
}

export default function ShiftSelector({ selectedShift, onShiftChange }: ShiftSelectorProps) {
  const shifts: ShiftType[] = ['4hr', '8hr', '12hr'];

  return (
    <div className="flex gap-2">
      {shifts.map((shift) => (
        <Button
          key={shift}
          data-testid={`button-shift-${shift}`}
          variant={selectedShift === shift ? 'default' : 'outline'}
          size="sm"
          onClick={() => onShiftChange(shift)}
          className={
            selectedShift === shift
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-[0_0_15px_rgba(59,130,246,0.5)] border-0'
              : 'bg-black/30 border-blue-500/40 hover:border-blue-500 hover:bg-black/50'
          }
        >
          {shift.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
