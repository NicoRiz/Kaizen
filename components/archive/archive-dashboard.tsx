"use client";

import { PageHeader } from "@/components/page-header";
import { ArchiveSection } from "@/components/archive/archive-section";
import { useKaizenStore } from "@/lib/kaizen/use-kaizen-store";

export function ArchiveDashboard() {
  const { ready, completedItems, expiredItems } = useKaizenStore();

  return (
    <div className="space-y-6">
      <PageHeader
        label="Archivio"
        title="Progressi e accumulate"
        description="Le task e gli obiettivi SMART vengono archiviati automaticamente in base a completamento e scadenza."
      />

      {!ready ? (
        <p className="rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-5 text-sm text-zinc-400">
          Caricamento archivio...
        </p>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          <ArchiveSection
            title="Progressi"
            description="Task e obiettivi SMART completati entro la scadenza."
            items={completedItems}
          />
          <ArchiveSection
            title="Accumulate"
            description="Task e obiettivi SMART arrivati a scadenza senza completamento."
            items={expiredItems}
          />
        </div>
      )}
    </div>
  );
}
