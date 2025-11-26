import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LogOut, BarChart3 } from "lucide-react";

import DateSelector from "@/components/DateSelector";
import ShiftSelector from "@/components/ShiftSelector";
import TotalTimeDisplay from "@/components/TotalTimeDisplay";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import EditTaskDialog from "@/components/EditTaskDialog";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

import logoUrl from "@/assets/screenshot.png";
import { gsap } from "gsap";
import { toast } from "@/components/ui/use-toast";

import type { Task, TimeEntry } from "@/types/task";

import axios from "axios";

// ✅ MAIN FIX → Uses your Render backend
const API = import.meta.env.VITE_API_URL;

type ShiftType = "4hr" | "8hr" | "12hr";

const normalizeTask = (task: any): Task => ({
  ...task,
  description: task.description ?? "",
  tools: task.tools ?? [],
  timeEntries: task.timeEntries ?? [],
  completionPercent: task.completionPercent ?? 0,
});

export default function TrackerPage() {
  const [, setLocation] = useLocation();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedShift, setSelectedShift] = useState<ShiftType>("8hr");
  const [totalSeconds, setTotalSeconds] = useState(0);

  const [isRecording, setIsRecording] = useState(false);
  const [rawTasks, setRawTasks] = useState<any[]>([]);
  const [recordingStartTime, setRecordingStartTime] =
    useState<number | null>(null);

  const [showAnalytics, setShowAnalytics] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔥 FIXED → Load worklogs FROM RENDER BACKEND
  useEffect(() => {
    axios
      .get(`${API}/api/worklogs`)
      .catch((err) => console.error("Error fetching work logs:", err));
  }, []);

  const employeeData = JSON.parse(
    localStorage.getItem("employeeData") ||
      '{"employeeId":"","employeeName":"Guest"}'
  );

  const tasks: Task[] = rawTasks.map(normalizeTask);

  const shiftSeconds = {
    "4hr": 14400,
    "8hr": 28800,
    "12hr": 43200,
  };

  const calculateTotalSeconds = () => {
    let total = 0;

    tasks.forEach((task) =>
      task.timeEntries.forEach((entry) => {
        total += Math.floor(
          (new Date(entry.endTime).getTime() -
            new Date(entry.startTime).getTime()) /
            1000
        );
      })
    );

    if (isRecording && recordingStartTime) {
      total += Math.floor((Date.now() - recordingStartTime) / 1000);
    }

    return total;
  };

  useEffect(() => {
    setTotalSeconds(calculateTotalSeconds());
  }, [tasks, isRecording, recordingStartTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTotalSeconds(calculateTotalSeconds());
    }, 1000);

    return () => clearInterval(timer);
  }, [tasks, isRecording, recordingStartTime]);

  // 🔥 FIXED → Save worklog to RENDER backend
  const saveWorklogToServer = async (task: Task) => {
    try {
      const payload = {
        employeeEmpcode: employeeData.employeeId,
        project: task.project,
        title: task.title,
        description: task.description,
        tools: task.tools,
        timeEntries: task.timeEntries,
        shiftType: selectedShift,
        date: selectedDate.toISOString().slice(0, 10),
      };

      const resp = await fetch(`${API}/api/worklogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) return null;

      const json = await resp.json();
      return json.success ? json.worklogId : null;
    } catch (err) {
      console.error("Save worklog error:", err);
      return null;
    }
  };

  // SUBMIT TIMESHEET EMAIL
  const handleSubmitTimesheet = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const payload = {
        employeeName: employeeData.employeeName,
        employeeId: employeeData.employeeId,
        date: selectedDate.toISOString().slice(0, 10),
        shift: selectedShift,
        tasks,
      };

      const resp = await fetch(`${API}/api/submit-timesheet-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await resp.json();

      if (json.success) {
        toast({
          title: "Timesheet Submitted 🎉",
          description: "Your timesheet has been emailed!",
        });
      } else {
        toast({
          title: "Submission failed",
          description: "Please try again.",
        });
      }
    } catch {
      toast({
        title: "Error submitting",
        description: "Server error occurred.",
      });
    }

    setIsSubmitting(false);
  };

  // ADD TASK
  const handleAddTask = async (task: Task) => {
    const id = Date.now().toString();

    const newTask = { ...task, id, saved: false };
    setRawTasks((prev) => [...prev, newTask]);

    const worklogId = await saveWorklogToServer(newTask);

    if (worklogId) {
      setRawTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, saved: true, worklogId } : t
        )
      );
    }
  };

  const handleToggleComplete = (id: string) => {
    setRawTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, isComplete: !task.isComplete } : task
      )
    );
  };

  const handleEditTask = (id: string) => {
    const found = tasks.find((t) => t.id === id);
    if (found) {
      setEditingTask(found);
      setIsEditDialogOpen(true);
    }
  };

  const handleSaveEdit = (updated: Task) => {
    setRawTasks((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
    setEditingTask(null);
    setIsEditDialogOpen(false);
  };

  const handleSaveTask = (taskId: string, percent: number) => {
    setRawTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completionPercent: percent } : task
      )
    );
  };

  // RECORDING LOGIC
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingStartTime(Date.now());
  };

  const handleStopRecording = async () => {
    if (!recordingStartTime) return;

    const entry: TimeEntry = {
      id: Date.now().toString(),
      startTime: new Date(recordingStartTime).toISOString(),
      endTime: new Date().toISOString(),
    };

    const recordedTask: Task = {
      id: Date.now().toString(),
      project: "Recorded Session",
      title: "Time Recording",
      description: "Automatically tracked time",
      tools: [],
      timeEntries: [entry],
      isComplete: false,
      completionPercent: 0,
      saved: false,
    };

    setRawTasks((prev) => [...prev, recordedTask]);

    const worklogId = await saveWorklogToServer(recordedTask);
    if (worklogId) {
      setRawTasks((prev) =>
        prev.map((t) =>
          t.id === recordedTask.id
            ? { ...t, saved: true, worklogId }
            : t
        )
      );
    }

    setIsRecording(false);
    setRecordingStartTime(null);
  };

  const canSubmit = totalSeconds >= shiftSeconds[selectedShift];

  const handleLogout = () => {
    gsap.to(".tracker-container", {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: () => setLocation("/"),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-blue-950 relative overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-xl border-b border-blue-500/30">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src={logoUrl} className="h-10" />
            <div className="hidden sm:block">
              <p className="text-xs text-muted-foreground">Employee</p>
              <p className="text-sm font-semibold">{employeeData.employeeName}</p>
              <p className="text-xs text-blue-400 font-mono">
                ID: {employeeData.employeeId}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnalytics((prev) => !prev)}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {showAnalytics ? "Hide" : "Show"} Analytics
            </Button>

            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 bg-blue-900/20 p-6 rounded-lg">
          <DateSelector
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

          <ShiftSelector
            selectedShift={selectedShift}
            onShiftChange={setSelectedShift}
          />
        </div>

        <TotalTimeDisplay
          totalSeconds={totalSeconds}
          shiftSeconds={shiftSeconds[selectedShift]}
          isRecording={isRecording}
        />

        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onEditTask={handleEditTask}
          onSaveTask={handleSaveTask}
        />

        <EditTaskDialog
          task={editingTask ?? null}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setEditingTask(null);
          }}
          onSave={handleSaveEdit}
        />

        <TaskForm
          onAddTask={handleAddTask}
          isRecording={isRecording}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
        />

        {showAnalytics && <AnalyticsDashboard tasks={tasks} />}

        <div className="flex justify-center pt-4">
          <Button
            disabled={!canSubmit || isSubmitting}
            onClick={handleSubmitTimesheet}
            className={
              canSubmit
                ? "bg-green-600 hover:bg-green-500 px-12 py-6 text-lg"
                : "px-12 py-6 text-lg opacity-40"
            }
          >
            {isSubmitting
              ? "Submitting..."
              : canSubmit
              ? "Submit Timesheet"
              : `Complete ${selectedShift.toUpperCase()} Shift`}
          </Button>
        </div>
      </main>
    </div>
  );
}
