"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  deleteTask,
  fetchTasks,
  updateTaskStatus,
  type TaskPriority,
  type Task,
} from "@/services/api";

function TaskListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="h-4 w-4 rounded bg-muted" />
            <div className="h-4 flex-1 rounded bg-muted" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TaskListError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <Card className="border-destructive">
      <CardContent className="py-4">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}

function priorityLabel(priority: TaskPriority): string {
  if (priority === "high") return "High";
  if (priority === "low") return "Low";
  return "Medium";
}

function priorityBadgeClass(priority: TaskPriority): string {
  if (priority === "high") {
    return "border-red-200 bg-red-50 text-red-700";
  }
  if (priority === "low") {
    return "border-green-200 bg-green-50 text-green-700";
  }
  return "border-amber-200 bg-amber-50 text-amber-700";
}

function TaskItem({
  task,
  busy,
  onToggle,
  onDelete,
}: {
  task: Task;
  busy: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const done = task.status === "DONE";

  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-3">
        <Checkbox
          checked={done}
          disabled={busy}
          onCheckedChange={() => onToggle(task.id)}
        />
        <div className="flex flex-1 items-center gap-2">
          <span
            className={`text-sm ${done ? "line-through text-muted-foreground" : ""}`}
          >
            {task.title}
          </span>
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-medium ${priorityBadgeClass(
              task.priority,
            )}`}
          >
            {priorityLabel(task.priority)}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          disabled={busy}
          onClick={() => onDelete(task.id)}
          className="text-muted-foreground hover:text-destructive"
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const retryLoad = useCallback(() => {
    setLoading(true);
    setListError(null);
    void fetchTasks()
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        setListError(
          err instanceof Error ? err.message : "Failed to load tasks",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;
    void fetchTasks()
      .then((data) => {
        if (!cancelled) {
          setTasks(data);
          setListError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setListError(
            err instanceof Error ? err.message : "Failed to load tasks",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggle = async (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const nextStatus = task.status === "DONE" ? "TODO" : "DONE";

    setPendingId(id);
    setActionError(null);
    try {
      const updated = await updateTaskStatus(id, nextStatus);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update task");
    } finally {
      setPendingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    setPendingId(id);
    setActionError(null);
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete task");
    } finally {
      setPendingId(null);
    }
  };

  if (loading) {
    return <TaskListSkeleton />;
  }

  if (listError) {
    return <TaskListError error={listError} onRetry={retryLoad} />;
  }

  return (
    <div className="space-y-2">
      {actionError && (
        <p className="text-sm text-destructive" role="alert">
          {actionError}
        </p>
      )}
      {tasks.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No tasks yet. Create one above!
          </CardContent>
        </Card>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            busy={pendingId === task.id}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}
