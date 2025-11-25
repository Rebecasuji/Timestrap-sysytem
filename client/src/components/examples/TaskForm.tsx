import { useState } from 'react';
import TaskForm from '../TaskForm';

export default function TaskFormExample() {
  const [isRecording, setIsRecording] = useState(false);
  
  return (
    <div className="p-8 bg-background max-w-2xl">
      <TaskForm
        onAddTask={(task) => console.log('Task added:', task)}
        isRecording={isRecording}
        onStartRecording={() => setIsRecording(true)}
        onStopRecording={() => setIsRecording(false)}
      />
    </div>
  );
}
