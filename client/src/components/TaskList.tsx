import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  Pencil,
  Save,
} from "lucide-react";
import { gsap } from "gsap";

import type { Task, TimeEntry } from "@/types/task";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEditTask: (id: string) => void;
  onSaveTask?: (id: string, percent: number) => void;
}

/* ----------------------------------------------------------
   SAFE FORMAT TIME (NO UTC SHIFT)
---------------------------------------------------------- */
function formatTime(value: string) {
  if (!value) return "";

  // datetime-local example: "2025-01-24T22:30"
  const [date, time] = value.split("T");
  let [hour, minute] = time.split(":");

  let h = parseInt(hour);
  let ampm = "AM";

  if (h === 0) {
    h = 12;
  } else if (h === 12) {
    ampm = "PM";
  } else if (h > 12) {
    h = h - 12;
    ampm = "PM";
  }

  return `${h}:${minute} ${ampm}`;
}

/* ----------------------------------------------------------
   SAFE DURATION CALCULATION
   (Uses local time string directly)
---------------------------------------------------------- */
function getDuration(entries: TimeEntry[]) {
  const toMs = (str: string) => new Date(str.replace(" ", "T")).getTime();

  let total = 0;

  entries.forEach((entry) => {
    total += toMs(entry.endTime) - toMs(entry.startTime);
  });

  const hours = Math.floor(total / 3600000);
  const minutes = Math.floor((total % 3600000) / 60000);

  return `${hours}h ${minutes}m`;
}

function TaskItem({
  task,
  onToggleComplete,
  onEditTask,
  onSaveTask,
}: {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEditTask: (id: string) => void;
  onSaveTask?: (id: string, percent: number) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [percent, setPercent] = useState(task.completionPercent ?? 0);

  const detailsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // expand animation
  useEffect(() => {
    if (!detailsRef.current) return;

    if (isExpanded) {
      gsap.fromTo(
        detailsRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.3 }
      );
    } else {
      gsap.to(detailsRef.current, { height: 0, opacity: 0, duration: 0.3 });
    }
  }, [isExpanded]);

  // progress animation
  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${percent}%`,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, [percent]);

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-950/20 to-cyan-950/20 border-blue-500/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-blue-500/20 text-blue-300">
              {task.project}
            </Badge>

            {task.isComplete && (
              <Badge className="bg-green-500/20 text-green-300 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Complete
              </Badge>
            )}
          </div>

          {/* Title */}
          <h4 className="text-lg font-semibold mb-1">{task.title}</h4>

          {/* Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {task.timeEntries.length} entries
            </span>

            <span className="font-mono text-blue-400">
              {getDuration(task.timeEntries)}
            </span>
          </div>

          {/* Progress */}
          <div className="mt-3">
            <p className="text-sm font-medium mb-1">
              Completion: {percent}%
            </p>

            <div className="w-full bg-blue-900/30 h-2 rounded overflow-hidden">
              <div
                ref={progressRef}
                className="h-full bg-blue-500 rounded"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          <Button variant="outline" size="sm" onClick={() => onEditTask(task.id)}>
            <Pencil className="h-3 w-3 mr-1" /> Edit
          </Button>

          <Button
            size="sm"
            onClick={() => onToggleComplete(task.id)}
            className={
              task.isComplete
                ? "bg-gray-600"
                : "bg-gradient-to-r from-green-600 to-emerald-600"
            }
          >
            {task.isComplete ? "Undo" : "Complete"}
          </Button>
        </div>
      </div>

      {/* Expanded Section */}
      <div ref={detailsRef} style={{ height: 0, opacity: 0, overflow: "hidden" }}>
        <div className="mt-4 pt-4 border-t border-blue-500/20 space-y-3">
          
          {/* Percent Update */}
          <div>
            <p className="text-sm font-medium mb-1">Update Completion %</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={100}
                value={percent}
                onChange={(e) =>
                  setPercent(Math.min(100, Math.max(0, Number(e.target.value))))
                }
                className="w-20 bg-black/30 border border-blue-500/30 rounded px-2 py-1"
              />
              {onSaveTask && (
                <Button
                  size="sm"
                  className="bg-blue-600"
                  onClick={() => onSaveTask(task.id, percent)}
                >
                  <Save className="h-3 w-3 mr-1" /> Save
                </Button>
              )}
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <p className="text-sm font-medium mb-1">Description</p>
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </div>
          )}

          {/* Tools */}
          {task.tools.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Tools Used</p>
              <div className="flex flex-wrap gap-1">
                {task.tools.map((tool) => (
                  <Badge
                    key={tool}
                    className="bg-cyan-500/10 text-cyan-300 border-cyan-500/30 text-xs"
                  >
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Time Entries */}
          {task.timeEntries.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Time Entries</p>

              <div className="space-y-1">
                {task.timeEntries.map((entry, i) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <span className="font-mono text-blue-400">#{i + 1}</span>

                    <span>
                      {formatTime(entry.startTime)} – {formatTime(entry.endTime)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </Card>
  );
}

/* ----------------------------------------------------------
   MAIN LIST WRAPPER
---------------------------------------------------------- */
export default function TaskList({
  tasks,
  onToggleComplete,
  onEditTask,
  onSaveTask,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Card className="p-12 text-center bg-gradient-to-br from-blue-950/10 to-cyan-950/10">
        <p className="text-muted-foreground">
          No tasks added yet. Click "Add Task" to begin.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEditTask={onEditTask}
          onSaveTask={onSaveTask}
        />
      ))}
    </div>
  );
}
