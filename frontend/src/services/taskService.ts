export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

let tasks: Task[] = [
  {
    id: "1",
    title: "Set up Next.js project",
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Add TailwindCSS styling",
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Integrate shadcn/ui components",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

export async function getTasks(): Promise<Task[]> {
  try {
    const res = await fetch(`${API_URL}/tasks`);
    if (!res.ok) throw new Error(`Failed to fetch tasks: ${res.status}`);
    return res.json();
  } catch {
    return [...tasks];
  }
}

export async function createTask(title: string): Promise<Task> {
  const newTask: Task = {
    id: Date.now().toString(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error(`Failed to create task: ${res.status}`);
    return res.json();
  } catch {
    tasks = [newTask, ...tasks];
    return newTask;
  }
}

export async function toggleTask(id: string): Promise<Task> {
  try {
    const res = await fetch(`${API_URL}/tasks/${id}/toggle`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error(`Failed to toggle task: ${res.status}`);
    return res.json();
  } catch {
    const task = tasks.find((t) => t.id === id);
    if (!task) throw new Error("Task not found");
    task.completed = !task.completed;
    return { ...task };
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Failed to delete task: ${res.status}`);
  } catch {
    tasks = tasks.filter((t) => t.id !== id);
  }
}
