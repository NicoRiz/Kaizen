"use client";

import { RotateCcw, Trash2, X } from "lucide-react";
import { DescriptionPreview } from "@/components/description-preview";
import { formatDateTime } from "@/lib/kaizen/date-utils";
import type { ArchivedItem } from "@/lib/kaizen/types";

type ArchiveSectionProps = {
  title: string;
  items: ArchivedItem[];
  onClose: () => void;
  onDeleteItem: (item: ArchivedItem) => void;
  onRestoreItem: (item: ArchivedItem) => void;
};

const statusLabels = {
  completed: "completato",
  expired: "scaduto",
  active: "attivo",
};

const weightLabels = {
  primary: "Primaria",
  secondary: "Secondaria",
};

export function ArchiveSection({ title, items, onClose, onDeleteItem, onRestoreItem }: ArchiveSectionProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/65 px-4 py-5 backdrop-blur-sm sm:items-center sm:justify-center">
      <section className="max-h-[88vh] w-full overflow-hidden rounded-3xl border border-white/10 bg-ink-900 shadow-soft sm:max-w-4xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-moss-300">Archivio</p>
            <h2 className="mt-2 text-xl font-semibold text-zinc-50">{title}</h2>
            <p className="mt-1 text-sm text-zinc-400">Totale elementi: {items.length}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi archivio"
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition hover:bg-white/5 hover:text-zinc-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[calc(88vh-7rem)] overflow-y-auto p-5">
          <div className="grid gap-3">
            {items.length > 0 ? (
              items.map((item) => (
                <article key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-moss-400/15 px-3 py-1 text-xs font-semibold text-moss-300">
                      {item.type === "task" ? "Task" : "Obiettivo"}
                    </span>
                    <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-zinc-300">
                      {statusLabels[item.status]}
                    </span>
                  </div>

                  <h3 className="font-medium text-zinc-50">{item.title}</h3>
                  <DescriptionPreview description={item.description} />

                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-xs uppercase tracking-[0.18em] text-zinc-500">Creazione</dt>
                      <dd className="mt-1 text-zinc-300">{formatDateTime(item.createdAt)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.18em] text-zinc-500">Scadenza</dt>
                      <dd className="mt-1 text-zinc-300">{formatDateTime(item.deadline)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.18em] text-zinc-500">Completamento</dt>
                      <dd className="mt-1 text-zinc-300">
                        {item.completedAt ? formatDateTime(item.completedAt) : "Non presente"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        {item.type === "task" ? "Peso" : "Progresso finale"}
                      </dt>
                      <dd className="mt-1 text-zinc-300">
                        {item.type === "task" ? weightLabels[item.weight] : `${item.currentValue}/${item.targetValue}`}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => onRestoreItem(item)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-white/5"
                    >
                      <RotateCcw size={16} />
                      Contrassegna come non fatto
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteItem(item)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-300/20 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-400/10"
                    >
                      <Trash2 size={16} />
                      Elimina definitivamente
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-5 text-sm leading-6 text-zinc-400">
                Nessun elemento in questa sezione.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
