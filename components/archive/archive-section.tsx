"use client";

import { formatDateTime } from "@/lib/kaizen/date-utils";
import type { ArchivedItem } from "@/lib/kaizen/types";

type ArchiveSectionProps = {
  title: string;
  description: string;
  items: ArchivedItem[];
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

export function ArchiveSection({ title, description, items }: ArchiveSectionProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-soft">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-zinc-50">{title}</h2>
        <p className="mt-1 text-sm text-zinc-400">{description}</p>
      </div>

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
            </article>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-5 text-sm leading-6 text-zinc-400">
            Nessun elemento in questa sezione.
          </p>
        )}
      </div>
    </section>
  );
}
