import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { Plus, Trash2 } from 'lucide-react';
import ToolsMultiSelect from './ToolsMultiSelect';
import DateTimePicker from "@/components/DateTimePicker";

import type { Task, TimeEntry } from '@/types/task';

interface EditTaskDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
}

export default function EditTaskDialog({
  task,
  isOpen,
  onClose,
  onSave
}: EditTaskDialogProps) {
  const [project, setProject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tools, setTools] = useState<string[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);

  /* ----------------------------------------------------
      LOAD TASK DATA
  ---------------------------------------------------- */
  useEffect(() => {
    if (task) {
      setProject(task.project);
      setTitle(task.title);
      setDescription(task.description ?? "");
      setTools(task.tools);

      setTimeEntries(
        task.timeEntries.map((e) => ({
          id: e.id,
          startTime: e.startTime,
          endTime: e.endTime,
        }))
      );
    }
  }, [task]);

  /* ----------------------------------------------------
      TIME ENTRY HANDLERS
  ---------------------------------------------------- */
  const handleAddTimeEntry = () => {
    const now = new Date().toISOString();
    setTimeEntries((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        startTime: now,
        endTime: now,
      },
    ]);
  };

  const handleRemoveTimeEntry = (id: string) => {
    setTimeEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleUpdateTimeEntry = (
    id: string,
    field: keyof TimeEntry,
    value: string
  ) => {
    setTimeEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      )
    );
  };

  /* ----------------------------------------------------
      SAVE TASK
  ---------------------------------------------------- */
  const handleSave = () => {
    if (!task) return;

    const updated: Task = {
      ...task,
      project,
      title,
      description,
      tools,
      timeEntries,
    };

    onSave(updated);
    onClose();
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-black/40 border-blue-500/30 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* Project */}
          <div>
            <Label className="text-foreground">Project</Label>
            <Input
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="bg-black/30 border-blue-500/40"
            />
          </div>

          {/* Title */}
          <div>
            <Label className="text-foreground">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-black/30 border-blue-500/40"
            />
          </div>

          {/* Description */}
          <div>
            <Label className="text-foreground">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-black/30 border-blue-500/40"
            />
          </div>

          {/* Tools */}
          <div>
            <Label className="text-foreground">Tools Used</Label>
            <ToolsMultiSelect
              selectedTools={tools}
              onToolsChange={setTools}
            />
          </div>

          {/* TIME ENTRIES */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-foreground">Time Entries</Label>
              <Button size="sm" onClick={handleAddTimeEntry}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            <div className="space-y-3">
              {timeEntries.map((entry, i) => (
                <div
                  key={entry.id}
                  className="p-3 border border-blue-500/20 rounded bg-black/30"
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-blue-300">Entry #{i + 1}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveTimeEntry(entry.id)}>
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Start time */}
                    <div>
                      <Label className="text-xs opacity-70">Start</Label>
                      <DateTimePicker
                        value={entry.startTime}
                        onChange={(v) =>
                          handleUpdateTimeEntry(entry.id, "startTime", v)
                        }
                      />
                    </div>

                    {/* End time */}
                    <div>
                      <Label className="text-xs opacity-70">End</Label>
                      <DateTimePicker
                        value={entry.endTime}
                        onChange={(v) =>
                          handleUpdateTimeEntry(entry.id, "endTime", v)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>

            <Button onClick={handleSave} className="flex-1 bg-blue-600">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
