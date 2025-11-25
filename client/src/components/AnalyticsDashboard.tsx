import { Card } from '@/components/ui/card';
import { Doughnut, Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ------------------------
// TYPES
// ------------------------
interface TimeEntry {
  id: string;
  startTime: string;
  endTime: string;
}

interface Task {
  id: string;
  title: string;
  project: string;
  description: string;
  tools: string[];
  timeEntries: TimeEntry[];
  isComplete: boolean;
  completionPercent?: number;
}

interface AnalyticsProps {
  tasks: Task[];
}

export default function AnalyticsDashboard({ tasks }: AnalyticsProps) {

  // ---------------------------------------
  // 1. TOTAL WORK TIME
  // ---------------------------------------
  const totalWorkSeconds = tasks.reduce((total: number, task: Task) => {
    const taskTotal = task.timeEntries.reduce((sum: number, entry: TimeEntry) => {
      const start = new Date(entry.startTime).getTime();
      const end = new Date(entry.endTime).getTime();
      return sum + (end - start) / 1000;
    }, 0);

    return total + taskTotal;
  }, 0);

  // ---------------------------------------
  // 2. TOOLS USAGE COUNT
  // ---------------------------------------
  const toolCounts: Record<string, number> = {};

  tasks.forEach((task: Task) => {
    task.tools.forEach((tool: string) => {
      toolCounts[tool] = (toolCounts[tool] || 0) + 1;
    });
  });

  const toolLabels = Object.keys(toolCounts);
  const toolValues = Object.values(toolCounts);

  // ---------------------------------------
  // 3. TASK HOURS
  // ---------------------------------------
  const taskLabels = tasks.map((t: Task) => t.title);

  const taskHours = tasks.map((t: Task) => {
    const totalSeconds = t.timeEntries.reduce(
      (s: number, entry: TimeEntry) =>
        s +
        (new Date(entry.endTime).getTime() -
          new Date(entry.startTime).getTime()) /
          1000,
      0
    );
    return Number((totalSeconds / 3600).toFixed(2));
  });

  // ---------------------------------------
  // 4. PRODUCTIVITY
  // ---------------------------------------
  const productivityLabels = tasks.map((t: Task) => t.title);
  const productivityScores = tasks.map((t: Task) => t.completionPercent || 0);

  // ---------------------------------------
  // CHART DATASETS
  // ---------------------------------------

  const workBreakData = {
    labels: ['Work Time (hrs)', 'Break Time (est)', 'Tools Usage Score'],
    datasets: [
      {
        data: [
          totalWorkSeconds / 3600,
          toolValues.length * 0.2,
          toolValues.reduce((a: number, b: number) => a + b, 0)
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(14, 165, 233, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(6, 182, 212, 1)',
          'rgba(14, 165, 233, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const taskHoursData = {
    labels: taskLabels,
    datasets: [
      {
        label: 'Hours',
        data: taskHours,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2
      }
    ]
  };

  const productivityData = {
    labels: productivityLabels,
    datasets: [
      {
        label: 'Completion %',
        data: productivityScores,
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: 'rgba(6, 182, 212, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4
      }
    ]
  };

  const toolsUsageData = {
    labels: toolLabels,
    datasets: [
      {
        data: toolValues,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(34, 211, 238, 0.8)',
          'rgba(56, 189, 248, 0.8)',
          'rgba(96, 165, 250, 0.8)'
        ],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: '#E5E7EB',
          font: { size: 11 }
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-blue-500/30 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Work Overview</h3>
        <div className="h-64 flex items-center justify-center">
          <Doughnut data={workBreakData} options={chartOptions} />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-blue-500/30 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Task Hours</h3>
        <div className="h-64">
          <Bar data={taskHoursData} options={chartOptions} />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-blue-500/30 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Productivity</h3>
        <div className="h-64">
          <Line data={productivityData} options={chartOptions} />
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-blue-500/30 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Tools Usage</h3>
        <div className="h-64 flex items-center justify-center">
          <Pie data={toolsUsageData} options={chartOptions} />
        </div>
      </Card>
    </div>
  );
}
