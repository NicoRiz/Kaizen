"use client";

type ArchiveSummaryCardProps = {
  title: string;
  description: string;
  typeCounts: {
    taskTotal: number;
    goalTotal: number;
    taskWeekly: number;
    goalWeekly: number;
  };
  onOpen: () => void;
};

export function ArchiveSummaryCard({
  title,
  description,
  typeCounts,
  onOpen,
}: ArchiveSummaryCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-left shadow-soft transition hover:border-moss-400/45 hover:bg-moss-400/10"
    >
      <div className="mb-8 h-1.5 w-12 rounded-full bg-moss-400" />
      <h2 className="text-xl font-semibold text-zinc-50">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Totali</p>
          <div className="mt-3 space-y-2 text-sm text-zinc-300">
            <p className="flex items-center justify-between gap-4">
              <span>Task totali</span>
              <span className="text-lg font-semibold text-zinc-50">{typeCounts.taskTotal}</span>
            </p>
            <p className="flex items-center justify-between gap-4">
              <span>Obiettivi totali</span>
              <span className="text-lg font-semibold text-zinc-50">{typeCounts.goalTotal}</span>
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Questa settimana</p>
          <div className="mt-3 space-y-2 text-sm text-zinc-300">
            <p className="flex items-center justify-between gap-4">
              <span>Task</span>
              <span className="text-lg font-semibold text-zinc-50">{typeCounts.taskWeekly}</span>
            </p>
            <p className="flex items-center justify-between gap-4">
              <span>Obiettivi</span>
              <span className="text-lg font-semibold text-zinc-50">{typeCounts.goalWeekly}</span>
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
