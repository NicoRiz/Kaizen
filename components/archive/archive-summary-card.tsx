"use client";

type ArchiveSummaryCardProps = {
  title: string;
  description: string;
  totalCount: number;
  weeklyCount: number;
  onOpen: () => void;
};

export function ArchiveSummaryCard({
  title,
  description,
  totalCount,
  weeklyCount,
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

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Totale</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-50">{totalCount}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Questa settimana</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-50">{weeklyCount}</p>
        </div>
      </div>
    </button>
  );
}
