import { useState } from 'react';
import ShiftSelector from '../ShiftSelector';

export default function ShiftSelectorExample() {
  const [shift, setShift] = useState<'4hr' | '8hr' | '12hr'>('8hr');
  
  return (
    <div className="p-8 bg-background">
      <ShiftSelector selectedShift={shift} onShiftChange={setShift} />
    </div>
  );
}
