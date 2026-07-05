"use client";

import { Check, Pencil, Trash2 } from "lucide-react";
import { formatTimeRemaining } from "@/lib/kaizen/date-utils";
import type { KaizenTask } from "@/lib/kaizen/types";

type TodoItemProps = {
  task: KaizenTask;
  now: number;
  onComplete: (taskId: string) => void;
  onEdit: (task: KaizenTask) => void;
  onDelete: (taskId: string) => void;
};

const weightLabels = {
  primary: "Primaria",
  secondary: "Secondaria",
};

export function TodoItem({ task, now, onComplete, onEdit, onDelete }: TodoItemProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onComplete(task.id)}
          aria-label="Segna come completata"
          className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full border border-moss-400/50 text-moss-300 transition hover:bg-moss-400 hover:text-ink-950"
        >
          <Check size={15} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words font-medium text-zinc-50">{task.title}</h3>
            <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs font-semibold text-zinc-300">
              {weightLabels[task.weight]}
            </span>
            <span className="rounded-full bg-moss-400/10 px-2.5 py-1 text-xs font-semibold text-moss-300">
              Non completata
            </span>
          </div>
          <p className="mt-2 text-xs text-zinc-500">{formatTimeRemaining(task.deadline, now)}</p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label="Modifica task"
            className="flex size-9 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition hover:bg-white/5 hover:text-zinc-50"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            aria-label="Elimina task"
            className="flex size-9 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition hover:border-rose-300/30 hover:bg-rose-400/10 hover:text-rose-200"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
