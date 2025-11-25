import { useState } from 'react';
import TaskList from '../TaskList';

export default function TaskListExample() {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      project: 'Website Development',
      title: 'Design homepage mockup',
      description: 'Create responsive design for the new company homepage',
      tools: ['Canva', 'Notion', 'Google'],
      startTime: new Date(Date.now() - 7200000).toISOString(),
      endTime: new Date().toISOString(),
      isComplete: false
    },
    {
      id: '2',
      project: 'Client Meeting',
      title: 'Quarterly review with stakeholders',
      description: '',
      tools: ['MS Teams', 'PowerPoint', 'Excel'],
      startTime: new Date(Date.now() - 3600000).toISOString(),
      endTime: new Date().toISOString(),
      isComplete: true
    }
  ]);

  const handleToggle = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, isComplete: !task.isComplete } : task
    ));
  };

  return (
    <div className="p-8 bg-background max-w-4xl">
      <TaskList tasks={tasks} onToggleComplete={handleToggle} />
    </div>
  );
}
