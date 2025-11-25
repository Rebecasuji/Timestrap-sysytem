import { useState } from 'react';
import DateSelector from '../DateSelector';

export default function DateSelectorExample() {
  const [date, setDate] = useState(new Date());
  
  return (
    <div className="p-8 bg-background">
      <DateSelector selectedDate={date} onDateChange={setDate} />
    </div>
  );
}
