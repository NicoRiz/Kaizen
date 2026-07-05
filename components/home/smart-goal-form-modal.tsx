"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { fromDateTimeLocalValue, toDateTimeLocalValue } from "@/lib/kaizen/date-utils";
import type { SmartGoal } from "@/lib/kaizen/types";

type SmartGoalFormValues = {
  title: string;
  targetValue: number;
  currentValue: number;
  deadline: string;
};

type SmartGoalFormModalProps = {
  goal?: SmartGoal | null;
  onClose: () => void;
  onSave: (values: SmartGoalFormValues) => void;
};

function getDefaultDeadline() {
  return toDateTimeLocalValue(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
}

export function SmartGoalFormModal({ goal, onClose, onSave }: SmartGoalFormModalProps) {
  const [title, setTitle] = useState("");
  const [targetValue, setTargetValue] = useState(10);
  const [currentValue, setCurrentValue] = useState(0);
  const [deadline, setDeadline] = useState(getDefaultDeadline);
  const [error, setError] = useState("");

  const isEditing = Boolean(goal);
  const modalTitle = useMemo(() => (isEditing ? "Modifica obiettivo" : "Nuovo obiettivo SMART"), [isEditing]);

  useEffect(() => {
    setTitle(goal?.title ?? "");
    setTargetValue(goal?.targetValue ?? 10);
    setCurrentValue(goal?.currentValue ?? 0);
    setDeadline(goal ? toDateTimeLocalValue(goal.deadline) : getDefaultDeadline());
    setError("");
  }, [goal]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Inserisci il nome dell'obiettivo.");
      return;
    }

    if (targetValue <= 0) {
      setError("Il valore totale deve essere maggiore di 0.");
      return;
    }

    if (currentValue < 0 || currentValue > targetValue) {
      setError("Il progresso deve essere compreso tra 0 e il valore totale.");
      return;
    }

    if (new Date(deadline).getTime() <= Date.now()) {
      setError("La scadenza deve essere futura.");
      return;
    }

    onSave({
      title,
      targetValue,
      currentValue,
      deadline: fromDateTimeLocalValue(deadline),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60 px-4 py-5 backdrop-blur-sm sm:items-center sm:justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-3xl border border-white/10 bg-ink-900 p-5 shadow-soft sm:max-w-lg"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-moss-300">Obiettivi SMART</p>
            <h2 className="mt-2 text-xl font-semibold text-zinc-50">{modalTitle}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className="flex size-10 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition hover:bg-white/5 hover:text-zinc-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-zinc-200">Nome obiettivo</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-moss-400/60"
              placeholder="Es. Completare 10 lezioni"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-zinc-200">Valore totale</span>
              <input
                type="number"
                min="1"
                step="1"
                value={targetValue}
                onChange={(event) => setTargetValue(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-50 outline-none transition focus:border-moss-400/60"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-200">Valore iniziale</span>
              <input
                type="number"
                min="0"
                step="1"
                value={currentValue}
                onChange={(event) => setCurrentValue(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-50 outline-none transition focus:border-moss-400/60"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-zinc-200">Scadenza</span>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-50 outline-none transition focus:border-moss-400/60"
            />
          </label>
        </div>

        {error ? <p className="mt-4 text-sm text-rose-200">{error}</p> : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/5"
          >
            Annulla
          </button>
          <button
            type="submit"
            className="rounded-full bg-moss-400 px-5 py-3 text-sm font-semibold text-ink-950 transition hover:bg-moss-300"
          >
            Salva
          </button>
        </div>
      </form>
    </div>
  );
}
