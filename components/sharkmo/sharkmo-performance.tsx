"use client";

import { TrendingUp } from "lucide-react";
import { SharkmoBadge, SharkmoButton, SharkmoField, SharkmoPanel, sharkmoInputClass } from "@/components/sharkmo/sharkmo-ui";
import type { ContentItem, PerformanceEntry } from "@/lib/sharkmo/types";

type SharkmoPerformanceProps = {
  contents: ContentItem[];
  performances: PerformanceEntry[];
  selectedEntityId?: string | null;
  onUpdatePerformance: (entry: PerformanceEntry) => void;
  onDeletePerformance: (performanceId: string) => void;
  onCreatePerformance: (contentId: string) => void;
};

export function SharkmoPerformance({
  contents,
  performances,
  selectedEntityId,
  onUpdatePerformance,
  onDeletePerformance,
  onCreatePerformance,
}: SharkmoPerformanceProps) {
  const publishedContents = contents.filter((content) => content.status === "Pubblicato" || content.status === "Performance");

  function confirmDelete(entry: PerformanceEntry) {
    if (window.confirm("Sei sicuro di voler eliminare questa performance?")) {
      onDeletePerformance(entry.id);
    }
  }

  return (
    <div className="space-y-5">
      <SharkmoPanel>
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#d29f22]">Performance</p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-50">Risultati e lettura qualitativa</h1>
      </SharkmoPanel>

      <div className="grid gap-4 xl:grid-cols-2">
        {performances.length > 0 ? performances.map((entry) => {
          const content = contents.find((item) => item.id === entry.contentItemId);
          return (
            <PerformanceCard
              key={entry.id}
              entry={entry}
              content={content}
              selected={selectedEntityId === entry.id || selectedEntityId === entry.contentItemId}
              onUpdatePerformance={onUpdatePerformance}
              onDeletePerformance={() => confirmDelete(entry)}
            />
          );
        }) : (
          <SharkmoPanel>
            <p className="text-sm text-zinc-400">Nessuna performance registrata.</p>
          </SharkmoPanel>
        )}
      </div>

      <SharkmoPanel>
        <h2 className="mb-4 text-xl font-semibold text-zinc-50">Pubblicati da monitorare</h2>
        <div className="grid gap-3">
          {publishedContents.length > 0 ? publishedContents.map((content) => {
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
                    <SharkmoButton onClick={() => onCreatePerformance(content.id)}>Crea performance</SharkmoButton>
                  ) : null}
                </div>
              </div>
            );
          }) : (
            <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-5 text-sm text-zinc-400">
              Nessun contenuto pubblicato da monitorare.
            </p>
          )}
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
  onDeletePerformance,
}: {
  entry: PerformanceEntry;
  content?: ContentItem;
  selected?: boolean;
  onUpdatePerformance: (entry: PerformanceEntry) => void;
  onDeletePerformance: () => void;
}) {
  return (
    <SharkmoPanel className={selected ? "border-[#d29f22]/60" : undefined}>
      <div className="mb-4 flex items-start gap-3">
        <TrendingUp className="mt-1 text-[#d29f22]" size={20} />
        <div>
          <h2 className="text-lg font-semibold text-zinc-50">{content?.title ?? "Contenuto archiviato"}</h2>
          <p className="mt-1 text-sm text-zinc-400">{entry.platform} - {new Date(entry.publishedAt).toLocaleDateString("it-IT")}</p>
        </div>
      </div>
      <form
        className="grid gap-4"
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
            averageWatchTime: String(form.get("averageWatchTime")),
            retention: String(form.get("retention")),
            whatWorked: String(form.get("whatWorked")),
            whatToImprove: String(form.get("whatToImprove")),
            finalJudgement: String(form.get("finalJudgement")),
            notes: String(form.get("notes")),
          });
        }}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <SharkmoField label="Views"><input name="views" type="number" defaultValue={entry.views} className={sharkmoInputClass} /></SharkmoField>
          <SharkmoField label="Likes"><input name="likes" type="number" defaultValue={entry.likes} className={sharkmoInputClass} /></SharkmoField>
          <SharkmoField label="Commenti"><input name="comments" type="number" defaultValue={entry.comments} className={sharkmoInputClass} /></SharkmoField>
          <SharkmoField label="Condivisioni"><input name="shares" type="number" defaultValue={entry.shares} className={sharkmoInputClass} /></SharkmoField>
          <SharkmoField label="Salvataggi"><input name="saves" type="number" defaultValue={entry.saves} className={sharkmoInputClass} /></SharkmoField>
          <SharkmoField label="Follower guadagnati"><input name="followersGained" type="number" defaultValue={entry.followersGained} className={sharkmoInputClass} /></SharkmoField>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <SharkmoField label="Tempo medio visione opzionale"><input name="averageWatchTime" defaultValue={entry.averageWatchTime} className={sharkmoInputClass} /></SharkmoField>
          <SharkmoField label="Retention opzionale"><input name="retention" defaultValue={entry.retention} className={sharkmoInputClass} /></SharkmoField>
        </div>
        <SharkmoField label="Cosa ha funzionato"><textarea name="whatWorked" defaultValue={entry.whatWorked} className={sharkmoInputClass} /></SharkmoField>
        <SharkmoField label="Cosa migliorare"><textarea name="whatToImprove" defaultValue={entry.whatToImprove} className={sharkmoInputClass} /></SharkmoField>
        <SharkmoField label="Giudizio finale"><textarea name="finalJudgement" defaultValue={entry.finalJudgement} className={sharkmoInputClass} /></SharkmoField>
        <SharkmoField label="Note"><textarea name="notes" defaultValue={entry.notes} className={sharkmoInputClass} /></SharkmoField>
        <div className="flex flex-wrap justify-end gap-3">
          <SharkmoButton variant="danger" onClick={onDeletePerformance}>Elimina performance</SharkmoButton>
          <SharkmoButton type="submit">Aggiorna performance</SharkmoButton>
        </div>
      </form>
    </SharkmoPanel>
  );
}
