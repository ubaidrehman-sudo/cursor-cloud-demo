export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
}

function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url || !url.trim()) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Add it to .env.local (see .env.example).",
    );
  }
  return url.replace(/\/$/, "");
}

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const body: unknown = await res.json();
    if (
      body &&
      typeof body === "object" &&
      "message" in body &&
      body.message !== undefined
    ) {
      const { message } = body as { message: unknown };
      if (typeof message === "string") return message;
      if (Array.isArray(message)) return message.map(String).join(", ");
    }
  } catch {
    // ignore JSON parse errors
  }
  return `Request failed (${res.status})`;
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export function fetchTasks(): Promise<Task[]> {
  return apiRequest<Task[]>("/tasks");
}

export function createTask(title: string, priority: TaskPriority): Promise<Task> {
  return apiRequest<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify({ title, priority }),
  });
}

export function updateTaskStatus(
  id: number,
  status: TaskStatus,
): Promise<Task> {
  return apiRequest<Task>(`/tasks/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function deleteTask(id: number): Promise<void> {
  return apiRequest<void>(`/tasks/${id}`, { method: "DELETE" });
}
