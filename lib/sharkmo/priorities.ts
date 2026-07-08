import { getAreaActivity } from "@/lib/sharkmo/tracking";
import type { ContentItem, PerformanceEntry, PhilosophyConcept, ProductItem, SharkmoEvent, SharkmoPriority } from "@/lib/sharkmo/types";

function daysSince(value: string, now: Date) {
  return Math.floor((now.getTime() - new Date(value).getTime()) / (24 * 60 * 60 * 1000));
}

function hasPerformance(content: ContentItem, performances: PerformanceEntry[]) {
  return performances.some((performance) => performance.contentItemId === content.id);
}

function getNeglectedBoost(area: SharkmoPriority["area"], events: SharkmoEvent[], now: Date) {
  const activity = getAreaActivity(events, now);
  const max = Math.max(...activity.map((item) => item.count), 0);
  const current = activity.find((item) => item.area === area)?.count ?? 0;
  return max > current ? Math.min(18, (max - current) * 6) : 0;
}

export function generateSharkmoDailyPriorities(input: {
  contents: ContentItem[];
  products: ProductItem[];
  concepts: PhilosophyConcept[];
  performances: PerformanceEntry[];
  events: SharkmoEvent[];
  now?: Date;
}) {
  const now = input.now ?? new Date();
  const createdForDate = now.toISOString().slice(0, 10);
  const candidates: SharkmoPriority[] = [];

  input.contents.forEach((content) => {
    const stuckDays = daysSince(content.lastStatusChangeAt, now);
    const neglected = getNeglectedBoost("Content Studio", input.events, now);

    if (content.status === "Editato") {
      candidates.push({
        id: `priority-schedule-${content.id}`,
        title: `Programma o pubblica "${content.title}"`,
        area: "Content Studio",
        reason: "E gia editato, quindi e vicino alla chiusura.",
        entityType: "content",
        entityId: content.id,
        suggestedAction: "Programma contenuto",
        score: Math.min(86 + neglected + Math.min(stuckDays, 10), 100),
        completed: false,
        createdForDate,
      });
    }

    if (content.status === "Programmato" && content.publishDate && new Date(content.publishDate).getTime() <= now.getTime()) {
      candidates.push({
        id: `priority-publish-${content.id}`,
        title: `Pubblica "${content.title}"`,
        area: "Content Studio",
        reason: "La data programmata e oggi o gia passata.",
        entityType: "content",
        entityId: content.id,
        suggestedAction: "Segna pubblicato",
        score: Math.min(94 + neglected, 100),
        completed: false,
        createdForDate,
      });
    }

    if ((content.status === "Pubblicato" || content.status === "Performance") && !hasPerformance(content, input.performances)) {
      candidates.push({
        id: `priority-performance-${content.id}`,
        title: `Aggiorna Performance per "${content.title}"`,
        area: "Performance",
        reason: "Il contenuto e pubblicato ma non ha ancora statistiche inserite.",
        entityType: "content",
        entityId: content.id,
        suggestedAction: "Crea performance",
        score: Math.min(90 + getNeglectedBoost("Performance", input.events, now), 100),
        completed: false,
        createdForDate,
      });
    }

    if (content.status === "Script" && stuckDays >= 4) {
      candidates.push({
        id: `priority-record-${content.id}`,
        title: `Porta "${content.title}" a registrazione`,
        area: "Content Studio",
        reason: `Lo script e fermo da ${stuckDays} giorni.`,
        entityType: "content",
        entityId: content.id,
        suggestedAction: "Avanza stato",
        score: Math.min(72 + neglected + Math.min(stuckDays, 12), 100),
        completed: false,
        createdForDate,
      });
    }
  });

  input.products.forEach((product) => {
    const stuckDays = daysSince(product.lastStatusChangeAt, now);
    const neglected = getNeglectedBoost("Product Lab", input.events, now);

    if (product.status === "Tech pack in corso" || product.techPackStatus === "In corso") {
      candidates.push({
        id: `priority-techpack-${product.id}`,
        title: `Completa il tech pack "${product.name}"`,
        area: "Product Lab",
        reason: stuckDays >= 5 ? `Il prodotto e fermo da ${stuckDays} giorni in area tech pack.` : "Il tech pack e vicino alla chiusura.",
        entityType: "product",
        entityId: product.id,
        suggestedAction: "Completa tech pack",
        score: Math.min(88 + neglected + Math.min(stuckDays, 12), 100),
        completed: false,
        createdForDate,
      });
    } else if (product.status === "Mockup") {
      candidates.push({
        id: `priority-product-${product.id}`,
        title: `Avanza "${product.name}" oltre il mockup`,
        area: "Product Lab",
        reason: "Un prodotto in mockup puo diventare tech pack invece di restare idea visual.",
        entityType: "product",
        entityId: product.id,
        suggestedAction: "Apri prodotto",
        score: Math.min(72 + neglected, 100),
        completed: false,
        createdForDate,
      });
    }
  });

  input.concepts.forEach((concept) => {
    const neglected = getNeglectedBoost("Filosofia", input.events, now);

    if (concept.status === "Pronto per script") {
      candidates.push({
        id: `priority-concept-${concept.id}`,
        title: `Trasforma "${concept.title}" in script breve`,
        area: "Filosofia",
        reason: "Il concetto e gia pronto e alimenta la pipeline contenuti senza aprire idee casuali.",
        entityType: "philosophy",
        entityId: concept.id,
        suggestedAction: "Trasforma in script",
        score: Math.min(80 + neglected, 100),
        completed: false,
        createdForDate,
      });
    }
  });

  const byArea = new Map<SharkmoPriority["area"], SharkmoPriority[]>();
  candidates
    .sort((a, b) => b.score - a.score)
    .forEach((candidate) => {
      byArea.set(candidate.area, [...(byArea.get(candidate.area) ?? []), candidate]);
    });

  const balanced: SharkmoPriority[] = [];
  ["Content Studio", "Product Lab", "Filosofia", "Performance"].forEach((area) => {
    const item = byArea.get(area as SharkmoPriority["area"])?.[0];
    if (item && balanced.length < 3) balanced.push(item);
  });

  candidates.forEach((candidate) => {
    if (balanced.length < 3 && !balanced.some((item) => item.id === candidate.id)) {
      balanced.push(candidate);
    }
  });

  return balanced.sort((a, b) => b.score - a.score).slice(0, 3);
}
