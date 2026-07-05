"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import type { KaizenTask, TaskWeight } from "@/lib/kaizen/types";

type TodoFormValues = {
  title: string;
  description: string;
  weight: TaskWeight;
  durationHours: number;
};

type TodoFormModalProps = {
  task?: KaizenTask | null;
  onClose: () => void;
  onSave: (values: TodoFormValues) => void;
};

function getRemainingHours(task?: KaizenTask | null) {
  if (!task) {
    return 1;
  }

  const remainingMs = new Date(task.deadline).getTime() - Date.now();

  return Math.max(0.25, Math.round((remainingMs / 3600000) * 4) / 4);
}

export function TodoFormModal({ task, onClose, onSave }: TodoFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState<TaskWeight>("primary");
  const [durationHours, setDurationHours] = useState(1);
  const [error, setError] = useState("");

  const isEditing = Boolean(task);
  const modalTitle = useMemo(() => (isEditing ? "Modifica task" : "Nuova task"), [isEditing]);

  useEffect(() => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setWeight(task?.weight ?? "primary");
    setDurationHours(getRemainingHours(task));
    setError("");
  }, [task]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Inserisci il nome della task.");
      return;
    }

    if (durationHours <= 0) {
      setError("Le ore alla scadenza devono essere maggiori di 0.");
      return;
    }

    onSave({ title, description, weight, durationHours });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60 px-4 py-5 backdrop-blur-sm sm:items-center sm:justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-3xl border border-white/10 bg-ink-900 p-5 shadow-soft sm:max-w-lg"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-moss-300">To Do List</p>
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
            <span className="text-sm font-medium text-zinc-200">Nome task</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-moss-400/60"
              placeholder="Es. Scrivere il piano della giornata"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-200">Descrizione</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-moss-400/60"
              placeholder="Dettagli, contesto o note utili"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-200">Peso</span>
            <select
              value={weight}
              onChange={(event) => setWeight(event.target.value as TaskWeight)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-zinc-50 outline-none transition focus:border-moss-400/60"
            >
              <option value="primary">Primaria</option>
              <option value="secondary">Secondaria</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-200">Ore alla scadenza</span>
            <input
              type="number"
              min="0.25"
              step="0.25"
              value={durationHours}
              onChange={(event) => setDurationHours(Number(event.target.value))}
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
