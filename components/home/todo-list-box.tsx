"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { TodoFormModal } from "@/components/home/todo-form-modal";
import { TodoItem } from "@/components/home/todo-item";
import type { KaizenTask, TaskWeight } from "@/lib/kaizen/types";

type TodoListBoxProps = {
  ready: boolean;
  tasks: KaizenTask[];
  onAddTask: (values: { title: string; description: string; weight: TaskWeight; durationHours: number }) => void;
  onEditTask: (
    taskId: string,
    values: { title: string; description: string; weight: TaskWeight; durationHours: number },
  ) => void;
  onCompleteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
};

export function TodoListBox({
  ready,
  tasks,
  onAddTask,
  onEditTask,
  onCompleteTask,
  onDeleteTask,
}: TodoListBoxProps) {
  const [now, setNow] = useState(Date.now());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<KaizenTask | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 30000);

    return () => window.clearInterval(interval);
  }, []);

  function openCreateModal() {
    setEditingTask(null);
    setModalOpen(true);
  }

  return (
    <SectionCard title="To Do List" description="Solo le task attive, ordinate per prossima scadenza.">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={openCreateModal}
          aria-label="Aggiungi task"
          className="flex size-11 items-center justify-center rounded-full bg-moss-400 text-ink-950 transition hover:bg-moss-300"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="grid gap-3">
        {!ready ? (
          <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-5 text-sm text-zinc-400">
            Caricamento task...
          </p>
        ) : tasks.length > 0 ? (
          tasks
            .slice()
            .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
            .map((task) => (
              <TodoItem
                key={task.id}
                task={task}
                now={now}
                onComplete={onCompleteTask}
                onEdit={(selectedTask) => {
                  setEditingTask(selectedTask);
                  setModalOpen(true);
                }}
                onDelete={onDeleteTask}
              />
            ))
        ) : (
          <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-5 text-sm leading-6 text-zinc-400">
            Nessuna task attiva. Aggiungi una nuova attività per iniziare.
          </p>
        )}
      </div>

      {modalOpen ? (
        <TodoFormModal
          task={editingTask}
          onClose={() => setModalOpen(false)}
          onSave={(values) => {
            if (editingTask) {
              onEditTask(editingTask.id, values);
            } else {
              onAddTask(values);
            }

            setModalOpen(false);
          }}
        />
      ) : null}
    </SectionCard>
  );
}
