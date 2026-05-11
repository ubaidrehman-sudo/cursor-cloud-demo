"use client";

import { use, useState, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getTasks, toggleTask, deleteTask, type Task } from "@/services/taskService";

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

function TaskItem({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
        />
        <span
          className={`flex-1 text-sm ${
            task.completed ? "line-through text-muted-foreground" : ""
          }`}
        >
          {task.title}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task.id)}
          className="text-muted-foreground hover:text-destructive"
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}

function TaskListContent({ tasksPromise }: { tasksPromise: Promise<Task[]> }) {
  const initialTasks = use(tasksPromise);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async (id: string) => {
    try {
      const updated = await toggleTask(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  if (error) {
    return <TaskListError error={error} onRetry={() => setError(null)} />;
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No tasks yet. Create one above!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export function TaskList() {
  const [tasksPromise] = useState(() => getTasks());

  return (
    <Suspense fallback={<TaskListSkeleton />}>
      <TaskListContent tasksPromise={tasksPromise} />
    </Suspense>
  );
}
