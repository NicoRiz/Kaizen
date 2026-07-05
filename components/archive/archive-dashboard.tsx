"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { ArchiveSection } from "@/components/archive/archive-section";
import { ArchiveSummaryCard } from "@/components/archive/archive-summary-card";
import { getArchiveDate, isInCurrentWeek } from "@/lib/kaizen/date-utils";
import { useKaizenStore } from "@/lib/kaizen/use-kaizen-store";
import type { ArchivedItem } from "@/lib/kaizen/types";

type ActiveSection = "completed" | "expired" | null;

export function ArchiveDashboard() {
  const {
    ready,
    completedItems,
    expiredItems,
    deleteArchivedItem,
    restoreArchivedItem,
  } = useKaizenStore();
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);

  const completedCounts = useMemo(
    () => ({
      taskTotal: completedItems.filter((item) => item.type === "task").length,
      goalTotal: completedItems.filter((item) => item.type === "goal").length,
      taskWeekly: completedItems.filter((item) => item.type === "task" && isInCurrentWeek(getArchiveDate(item))).length,
      goalWeekly: completedItems.filter((item) => item.type === "goal" && isInCurrentWeek(getArchiveDate(item))).length,
    }),
    [completedItems],
  );
  const expiredCounts = useMemo(
    () => ({
      taskTotal: expiredItems.filter((item) => item.type === "task").length,
      goalTotal: expiredItems.filter((item) => item.type === "goal").length,
      taskWeekly: expiredItems.filter((item) => item.type === "task" && isInCurrentWeek(getArchiveDate(item))).length,
      goalWeekly: expiredItems.filter((item) => item.type === "goal" && isInCurrentWeek(getArchiveDate(item))).length,
    }),
    [expiredItems],
  );

  const modalItems = activeSection === "completed" ? completedItems : expiredItems;
  const modalTitle = activeSection === "completed" ? "Progressi" : "Accumulate";

  function handleDeleteItem(item: ArchivedItem) {
    if (!window.confirm("Vuoi eliminare definitivamente questo elemento?")) {
      return;
    }

    deleteArchivedItem(item.id, item.type);
  }

  function handleRestoreItem(item: ArchivedItem) {
    if (!window.confirm("Vuoi riportare questo elemento nella Home come non fatto?")) {
      return;
    }

    restoreArchivedItem(item.id, item.type);
  }

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
        <>
          <div className="grid gap-4 xl:grid-cols-2">
            <ArchiveSummaryCard
              title="Progressi"
              description="Task e obiettivi SMART completati entro la scadenza."
              typeCounts={completedCounts}
              onOpen={() => setActiveSection("completed")}
            />
            <ArchiveSummaryCard
              title="Accumulate"
              description="Task e obiettivi SMART arrivati a scadenza senza completamento."
              typeCounts={expiredCounts}
              onOpen={() => setActiveSection("expired")}
            />
          </div>

          {activeSection ? (
            <ArchiveSection
              title={modalTitle}
              items={modalItems}
              onClose={() => setActiveSection(null)}
              onDeleteItem={handleDeleteItem}
              onRestoreItem={handleRestoreItem}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
