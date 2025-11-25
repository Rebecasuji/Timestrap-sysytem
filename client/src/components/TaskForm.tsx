import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, X, Trash2 } from "lucide-react";
import ToolsMultiSelect from "./ToolsMultiSelect";
import { gsap } from "gsap";

// DateTimePicker
import DateTimePicker from "@/components/DateTimePicker";

import type { Task, TimeEntry } from "@/types/task";

interface TaskFormProps {
  onAddTask: (task: Task) => void;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export default function TaskForm({
  onAddTask,
  isRecording,
  onStartRecording,
  onStopRecording,
}: TaskFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [project, setProject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tools, setTools] = useState<string[]>([]);

  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
    },
  ]);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded && formRef.current) {
      gsap.fromTo(
        formRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [isExpanded]);

  // ⭐ FIXED — DO NOT RECONVERT ISO
  const handleUpdateTimeEntry = (
    id: string,
    field: "startTime" | "endTime",
    isoValue: string
  ) => {
    setTimeEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, [field]: isoValue } : entry
      )
    );
  };

  const handleAddTimeEntry = () => {
    setTimeEntries((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
      },
    ]);
  };

  const handleRemoveTimeEntry = (id: string) => {
    if (timeEntries.length > 1) {
      setTimeEntries(timeEntries.filter((e) => e.id !== id));
    }
  };

  const handleSubmit = () => {
    if (!project || !title) return;

    const newTask: Task = {
      id: Date.now().toString(),
      project,
      title,
      description,
      tools,
      isComplete: false,
      completionPercent: 0,
      timeEntries,
    };

    onAddTask(newTask);

    // Reset form
    setProject("");
    setTitle("");
    setDescription("");
    setTools([]);

    setTimeEntries([
      {
        id: Date.now().toString(),
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
      },
    ]);

    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <Button
        onClick={() => setIsExpanded(true)}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Task
      </Button>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-blue-500/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">New Task</h3>
        <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div ref={formRef} className="space-y-4">
        {/* Project */}
        <div>
          <Label>Project</Label>
          <Input
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="Enter project name"
          />
        </div>

        {/* Title */}
        <div>
          <Label>Task Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
          />
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <Textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
          />
        </div>

        {/* Tools */}
        <div>
          <Label>Tools Used</Label>
          <ToolsMultiSelect selectedTools={tools} onToolsChange={setTools} />
        </div>

        {/* Time Entries */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Time Entries</Label>

            <Button size="sm" onClick={handleAddTimeEntry}>
              <Plus className="h-3 w-3 mr-1" /> Add Entry
            </Button>
          </div>

          <div className="space-y-3">
            {timeEntries.map((entry, index) => (
              <div key={entry.id} className="p-3 bg-black/20 border border-blue-500/20 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Entry #{index + 1}</span>

                  {timeEntries.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveTimeEntry(entry.id)}>
                      <Trash2 className="h-3 w-3 text-red-400" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Start Time</Label>
                    <DateTimePicker
                      value={entry.startTime}
                      onChange={(iso) =>
                        handleUpdateTimeEntry(entry.id, "startTime", iso)
                      }
                    />
                  </div>

                  <div>
                    <Label className="text-xs">End Time</Label>
                    <DateTimePicker
                      value={entry.endTime}
                      onChange={(iso) =>
                        handleUpdateTimeEntry(entry.id, "endTime", iso)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={isRecording ? onStopRecording : onStartRecording}
            className={isRecording ? "flex-1 bg-red-600" : "flex-1 bg-blue-600"}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>

          <Button onClick={handleSubmit} disabled={!project || !title} className="flex-1 bg-blue-600">
            Save Task
          </Button>
        </div>
      </div>
    </Card>
  );
}
