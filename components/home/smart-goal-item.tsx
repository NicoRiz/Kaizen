"use client";

import { Pencil, Trash2 } from "lucide-react";
import { DescriptionPreview } from "@/components/description-preview";
import { formatDateTime } from "@/lib/kaizen/date-utils";
import type { SmartGoal } from "@/lib/kaizen/types";

type SmartGoalItemProps = {
  goal: SmartGoal;
  onEdit: (goal: SmartGoal) => void;
  onDelete: (goalId: string) => void;
  onUpdateProgress: (goalId: string, currentValue: number) => void;
};

export function SmartGoalItem({ goal, onEdit, onDelete, onUpdateProgress }: SmartGoalItemProps) {
  const progress = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="break-words font-medium text-zinc-50">{goal.title}</h3>
          <DescriptionPreview description={goal.description} />
          <p className="mt-2 text-xs text-zinc-500">Scadenza: {formatDateTime(goal.deadline)}</p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onEdit(goal)}
            aria-label="Modifica obiettivo"
            className="flex size-9 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition hover:bg-white/5 hover:text-zinc-50"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(goal.id)}
            aria-label="Elimina obiettivo"
            className="flex size-9 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition hover:border-rose-300/30 hover:bg-rose-400/10 hover:text-rose-200"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
          <span>Progresso</span>
          <span className="font-medium text-zinc-200">
            {goal.currentValue}/{goal.targetValue}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-moss-400" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <label className="mt-4 block">
        <span className="text-xs font-medium text-zinc-400">Aggiorna progresso</span>
        <input
          type="number"
          min="0"
          max={goal.targetValue}
          step="1"
          value={goal.currentValue}
          onChange={(event) => onUpdateProgress(goal.id, Number(event.target.value))}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-50 outline-none transition focus:border-moss-400/60"
        />
      </label>
    </article>
  );
}
