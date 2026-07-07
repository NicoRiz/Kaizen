"use client";

import { Activity, AlertTriangle, ArrowUpRight, BarChart3 } from "lucide-react";
import { SharkmoBadge, SharkmoButton, SharkmoPanel } from "@/components/sharkmo/sharkmo-ui";
import { generateSharkmoDailyPriorities } from "@/lib/sharkmo/priorities";
import { calculateMetricTrends, describeArea, getAreaActivity } from "@/lib/sharkmo/tracking";
import type { ContentItem, PhilosophyConcept, ProductItem, SharkmoState } from "@/lib/sharkmo/types";

type SharkmoHomeProps = {
  state: SharkmoState;
  onOpenArea: (area: string) => void;
};

function daysSince(value: string) {
  return Math.floor((Date.now() - new Date(value).getTime()) / (24 * 60 * 60 * 1000));
}

function getBlockedItems(contents: ContentItem[], products: ProductItem[], concepts: PhilosophyConcept[]) {
  const blocked = [
    ...contents
      .filter((item) => item.status !== "Archiviato" && daysSince(item.lastStatusChangeAt) >= 5)
      .map((item) => ({
        id: item.id,
        label: `${item.status} fermo da ${daysSince(item.lastStatusChangeAt)} giorni`,
        title: item.title,
      })),
    ...products
      .filter((item) => item.status !== "Archiviato" && daysSince(item.lastStatusChangeAt) >= 5)
      .map((item) => ({
        id: item.id,
        label: `${item.status} da ${daysSince(item.lastStatusChangeAt)} giorni`,
        title: item.name,
      })),
    ...concepts
      .filter((item) => item.status !== "Archiviato" && daysSince(item.updatedAt) >= 6)
      .map((item) => ({
        id: item.id,
        label: `${item.status} da ${daysSince(item.updatedAt)} giorni`,
        title: item.title,
      })),
  ];

  return blocked.slice(0, 5);
}

export function SharkmoHome({ state, onOpenArea }: SharkmoHomeProps) {
  const priorities = generateSharkmoDailyPriorities({
    contents: state.contents,
    products: state.products,
    concepts: state.concepts,
    performances: state.performances,
    events: state.events,
  });
  const metrics = calculateMetricTrends(state.events);
  const areaActivity = getAreaActivity(state.events);
  const blockedItems = getBlockedItems(state.contents, state.products, state.concepts);
  const leastActive = areaActivity.slice().sort((a, b) => a.count - b.count)[0];
  const mostActive = areaActivity.slice().sort((a, b) => b.count - a.count)[0];

  return (
    <div className="space-y-5">
      <SharkmoPanel className="bg-gradient-to-br from-[#5d0018]/70 via-[#19121b] to-[#252628]">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#d29f22]">SM Home</p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-50 sm:text-4xl">Sharkmo operativo</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">
          Dashboard giornaliera per chiudere contenuti, far avanzare capi e trasformare filosofia in output reali.
        </p>
      </SharkmoPanel>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <SharkmoPanel>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-zinc-50">Priorità di oggi</h2>
              <p className="mt-1 text-sm text-zinc-400">Massimo 3, generate dallo stato reale del progetto.</p>
            </div>
            <SharkmoBadge>{priorities.length}/3</SharkmoBadge>
          </div>
          <div className="grid gap-3">
            {priorities.map((priority) => (
              <article key={priority.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <SharkmoBadge tone={priority.area === "Product Lab" ? "red" : "gold"}>{priority.area}</SharkmoBadge>
                  <span className="text-xs text-zinc-500">Score {priority.score}</span>
                </div>
                <h3 className="mt-3 font-semibold text-zinc-50">{priority.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{priority.reason}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs text-zinc-500">Elemento: {priority.entityType}</span>
                  <SharkmoButton variant="ghost" onClick={() => onOpenArea(priority.area)}>
                    {priority.suggestedAction}
                  </SharkmoButton>
                </div>
              </article>
            ))}
          </div>
        </SharkmoPanel>

        <SharkmoPanel>
          <div className="mb-4 flex items-center gap-3">
            <Activity className="text-[#d29f22]" size={20} />
            <div>
              <h2 className="text-xl font-semibold text-zinc-50">Equilibrio Sharkmo</h2>
              <p className="text-sm text-zinc-400">Ultimi 7 giorni per area.</p>
            </div>
          </div>
          <div className="grid gap-3">
            {areaActivity.map((item) => (
              <div key={item.area} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <span className="text-sm text-zinc-300">{item.area}</span>
                <SharkmoBadge tone={item.count >= 2 ? "gold" : "dark"}>{describeArea(item.count)}</SharkmoBadge>
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-2xl border border-[#d29f22]/15 bg-[#d29f22]/10 p-4 text-sm leading-6 text-zinc-200">
            Negli ultimi giorni hai lavorato di più su {mostActive.area}. {leastActive.area} è l’area più scoperta:
            le priorità spingono a riequilibrare il progetto.
          </p>
        </SharkmoPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <SharkmoPanel>
          <div className="mb-4 flex items-center gap-3">
            <BarChart3 className="text-[#d29f22]" size={20} />
            <h2 className="text-xl font-semibold text-zinc-50">Tracciamento attività</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {metrics.map((metric) => (
              <div key={metric.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm text-zinc-400">{metric.label}</p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <span className="text-2xl font-semibold text-zinc-50">{metric.current}</span>
                  <SharkmoBadge tone={metric.trend === "In calo" ? "red" : "gold"}>{metric.trend}</SharkmoBadge>
                </div>
              </div>
            ))}
          </div>
        </SharkmoPanel>

        <SharkmoPanel>
          <div className="mb-4 flex items-center gap-3">
            <AlertTriangle className="text-[#d29f22]" size={20} />
            <h2 className="text-xl font-semibold text-zinc-50">Elementi bloccati</h2>
          </div>
          <div className="grid gap-3">
            {blockedItems.length > 0 ? blockedItems.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="font-medium text-zinc-50">{item.title}</p>
                <p className="mt-1 text-sm text-zinc-400">{item.label}</p>
              </div>
            )) : (
              <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-5 text-sm text-zinc-400">
                Nessun blocco critico. Continua a chiudere task.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onOpenArea("Content Studio")}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#d29f22]"
          >
            Vai alla pipeline <ArrowUpRight size={16} />
          </button>
        </SharkmoPanel>
      </div>
    </div>
  );
}
