import { useState, useEffect } from 'react';
import TotalTimeDisplay from '../TotalTimeDisplay';

export default function TotalTimeDisplayExample() {
  const [seconds, setSeconds] = useState(14400);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRecording) {
        setSeconds(s => s + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div className="p-8 bg-background">
      <TotalTimeDisplay 
        totalSeconds={seconds} 
        shiftSeconds={28800}
        isRecording={isRecording}
      />
      <button 
        onClick={() => setIsRecording(!isRecording)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isRecording ? 'Stop' : 'Start'} Recording
      </button>
    </div>
  );
}
