import type { SharkmoArea, SharkmoEvent, SharkmoEventType } from "@/lib/sharkmo/types";

export type TrendLabel = "In crescita" | "Stabile" | "In calo" | "Nessun dato sufficiente";

export type MetricDefinition = {
  key: string;
  label: string;
  eventTypes: SharkmoEventType[];
};

export type MetricTrend = {
  key: string;
  label: string;
  current: number;
  previous: number;
  trend: TrendLabel;
};

export const sharkmoMetrics: MetricDefinition[] = [
  { key: "published", label: "Contenuti pubblicati", eventTypes: ["CONTENT_PUBLISHED"] },
  { key: "recorded", label: "Contenuti registrati", eventTypes: ["CONTENT_RECORDED"] },
  { key: "edited", label: "Contenuti editati", eventTypes: ["CONTENT_EDITED"] },
  { key: "ideas", label: "Idee create o trasformate", eventTypes: ["CONTENT_CREATED", "IDEA_TRANSFORMED", "PHILOSOPHY_TRANSFORMED"] },
  { key: "advanced", label: "Capi creati o avanzati", eventTypes: ["PRODUCT_CREATED", "PRODUCT_ADVANCED"] },
  { key: "techpacks", label: "Tech pack completati", eventTypes: ["TECH_PACK_COMPLETED"] },
  { key: "to-performance", label: "Contenuti spostati in performance", eventTypes: ["CONTENT_TO_PERFORMANCE", "PERFORMANCE_CREATED"] },
  { key: "performance", label: "Performance aggiornate", eventTypes: ["PERFORMANCE_CREATED", "PERFORMANCE_UPDATED", "PERFORMANCE_DELETED"] },
  { key: "products", label: "Prodotti modificati", eventTypes: ["PRODUCT_UPDATED", "PRODUCT_DELETED"] },
  { key: "concepts", label: "Concetti creati o trasformati", eventTypes: ["PHILOSOPHY_CREATED", "PHILOSOPHY_TRANSFORMED", "PHILOSOPHY_DELETED"] },
  { key: "priorities", label: "Priorita completate", eventTypes: ["PRIORITY_COMPLETED"] },
];

export function createSharkmoEvent(input: {
  type: SharkmoEventType;
  area: SharkmoArea;
  entityType: SharkmoEvent["entityType"];
  entityId: string;
  title: string;
  description: string;
  fromStatus?: string;
  toStatus?: string;
}) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    ...input,
  };
}

function countEvents(events: SharkmoEvent[], eventTypes: SharkmoEventType[], start: number, end: number) {
  return events.filter((event) => {
    const time = new Date(event.createdAt).getTime();
    return eventTypes.includes(event.type) && time >= start && time < end;
  }).length;
}

function getTrend(current: number, previous: number): TrendLabel {
  if (current > previous) {
    return "In crescita";
  }

  if (current === previous && current > 0) {
    return "Stabile";
  }

  if (current < previous) {
    return "In calo";
  }

  return "Nessun dato sufficiente";
}

export function calculateMetricTrends(events: SharkmoEvent[], now = new Date()) {
  const currentEnd = now.getTime();
  const currentStart = currentEnd - 7 * 24 * 60 * 60 * 1000;
  const previousStart = currentStart - 7 * 24 * 60 * 60 * 1000;

  return sharkmoMetrics.map((metric): MetricTrend => {
    const current = countEvents(events, metric.eventTypes, currentStart, currentEnd);
    const previous = countEvents(events, metric.eventTypes, previousStart, currentStart);

    return {
      key: metric.key,
      label: metric.label,
      current,
      previous,
      trend: getTrend(current, previous),
    };
  });
}

export function getAreaActivity(events: SharkmoEvent[], now = new Date()) {
  const start = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const areas: SharkmoArea[] = ["Content Studio", "Product Lab", "Filosofia", "Performance"];

  return areas.map((area) => ({
    area,
    count: events.filter((event) => event.area === area && new Date(event.createdAt).getTime() >= start).length,
  }));
}

export function describeArea(count: number) {
  if (count >= 4) return "molto attivo";
  if (count >= 2) return "stabile";
  if (count === 1) return "poco attivo";
  return "da aggiornare";
}
