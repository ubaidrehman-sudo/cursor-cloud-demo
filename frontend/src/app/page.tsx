"use client";

import { useState } from "react";
import { CreateTaskForm } from "@/components/create-task-form";
import { TaskList } from "@/components/task-list";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Task Manager</h1>
          <p className="mt-1 text-muted-foreground">
            A simple task tracker built with Next.js &amp; shadcn/ui
          </p>
        </header>

        <div className="space-y-6">
          <CreateTaskForm onTaskCreated={() => setRefreshKey((k) => k + 1)} />
          <section>
            <h2 className="mb-3 text-lg font-semibold">Tasks</h2>
            <TaskList key={refreshKey} />
          </section>
        </div>
      </div>
    </main>
  );
}
