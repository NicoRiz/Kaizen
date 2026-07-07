"use client";

import { TrendingUp } from "lucide-react";
import { SharkmoBadge, SharkmoButton, SharkmoField, SharkmoPanel, sharkmoInputClass } from "@/components/sharkmo/sharkmo-ui";
import type { ContentItem, PerformanceEntry } from "@/lib/sharkmo/types";

type SharkmoPerformanceProps = {
  contents: ContentItem[];
  performances: PerformanceEntry[];
  selectedEntityId?: string | null;
  onUpdatePerformance: (entry: PerformanceEntry) => void;
  onCreatePerformance: (contentId: string) => void;
};

export function SharkmoPerformance({
  contents,
  performances,
  selectedEntityId,
  onUpdatePerformance,
  onCreatePerformance,
}: SharkmoPerformanceProps) {
  const publishedContents = contents.filter((content) => content.status === "Pubblicato" || content.status === "Performance");

  return (
    <div className="space-y-5">
      <SharkmoPanel>
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#d29f22]">Performance</p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-50">Risultati e lettura qualitativa</h1>
      </SharkmoPanel>

      <div className="grid gap-4 xl:grid-cols-2">
        {performances.map((entry) => {
          const content = contents.find((item) => item.id === entry.contentItemId);
          return (
            <PerformanceCard
              key={entry.id}
              entry={entry}
              content={content}
              selected={selectedEntityId === entry.id || selectedEntityId === entry.contentItemId}
              onUpdatePerformance={onUpdatePerformance}
            />
          );
        })}
      </div>

      <SharkmoPanel>
        <h2 className="mb-4 text-xl font-semibold text-zinc-50">Pubblicati da monitorare</h2>
        <div className="grid gap-3">
          {publishedContents.map((content) => {
            const hasPerformance = performances.some((entry) => entry.contentItemId === content.id);
            return (
              <div key={content.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div>
                  <p className="font-medium text-zinc-50">{content.title}</p>
                  <p className="mt-1 text-sm text-zinc-400">{content.platform}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <SharkmoBadge tone={hasPerformance ? "gold" : "red"}>{hasPerformance ? "Performance collegata" : "Da aggiornare"}</SharkmoBadge>
                  {!hasPerformance ? (
                    <SharkmoButton onClick={() => onCreatePerformance(content.id)}>Crea/Aggiorna Performance</SharkmoButton>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </SharkmoPanel>
    </div>
  );
}

function PerformanceCard({
  entry,
  content,
  selected,
  onUpdatePerformance,
}: {
  entry: PerformanceEntry;
  content?: ContentItem;
  selected?: boolean;
  onUpdatePerformance: (entry: PerformanceEntry) => void;
}) {
  return (
    <SharkmoPanel className={selected ? "border-[#d29f22]/60" : undefined}>
      <div className="mb-4 flex items-start gap-3">
        <TrendingUp className="mt-1 text-[#d29f22]" size={20} />
        <div>
          <h2 className="text-lg font-semibold text-zinc-50">{content?.title ?? "Contenuto archiviato"}</h2>
          <p className="mt-1 text-sm text-zinc-400">{entry.platform} · {new Date(entry.publishedAt).toLocaleDateString("it-IT")}</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Views" value={entry.views} />
        <Metric label="Like" value={entry.likes} />
        <Metric label="Save" value={entry.saves} />
      </div>
      <form
        className="mt-4 grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          onUpdatePerformance({
            ...entry,
            views: Number(form.get("views")),
            likes: Number(form.get("likes")),
            comments: Number(form.get("comments")),
            shares: Number(form.get("shares")),
            saves: Number(form.get("saves")),
            followersGained: Number(form.get("followersGained")),
            whatWorked: String(form.get("whatWorked")),
            whatToImprove: String(form.get("whatToImprove")),
            notes: String(form.get("notes")),
          });
        }}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <input name="views" type="number" defaultValue={entry.views} className={sharkmoInputClass} />
          <input name="likes" type="number" defaultValue={entry.likes} className={sharkmoInputClass} />
          <input name="saves" type="number" defaultValue={entry.saves} className={sharkmoInputClass} />
          <input name="comments" type="number" defaultValue={entry.comments} className={sharkmoInputClass} />
          <input name="shares" type="number" defaultValue={entry.shares} className={sharkmoInputClass} />
          <input name="followersGained" type="number" defaultValue={entry.followersGained} className={sharkmoInputClass} />
        </div>
        <SharkmoField label="Cosa ha funzionato"><input name="whatWorked" defaultValue={entry.whatWorked} className={sharkmoInputClass} /></SharkmoField>
        <SharkmoField label="Cosa migliorare"><input name="whatToImprove" defaultValue={entry.whatToImprove} className={sharkmoInputClass} /></SharkmoField>
        <SharkmoField label="Note"><textarea name="notes" defaultValue={entry.notes} className={sharkmoInputClass} /></SharkmoField>
        <div className="flex justify-end">
          <SharkmoButton type="submit">Aggiorna performance</SharkmoButton>
        </div>
      </form>
    </SharkmoPanel>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-zinc-50">{value}</p>
    </div>
  );
}
