"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { sharkmoInitialState } from "@/lib/sharkmo/data";
import { generateSharkmoDailyPriorities } from "@/lib/sharkmo/priorities";
import { createSharkmoEvent } from "@/lib/sharkmo/tracking";
import type {
  ContentCategory,
  ContentItem,
  ContentStatus,
  PerformanceEntry,
  PhilosophyConcept,
  PhilosophyStatus,
  PhilosophyType,
  ProductCategory,
  ProductItem,
  ProductStatus,
  SharkmoPillar,
  SharkmoPriority,
  SharkmoState,
  TechPackStatus,
} from "@/lib/sharkmo/types";

const STORAGE_KEY = "sharkmo-operating-state-v1";

const contentFlow: ContentStatus[] = ["Idea", "Script", "Da registrare", "Registrato", "Da editare", "Editato", "Programmato", "Pubblicato", "Performance"];
const productFlow: ProductStatus[] = ["Idea", "Concept", "Design", "Mockup", "Tech pack in corso", "Tech pack completato", "Campione richiesto", "Campione ricevuto", "Revisione", "Pronto produzione"];

export type ContentDraftInput = {
  title: string;
  description?: string;
  category: ContentCategory;
  pillar: SharkmoPillar;
  platform?: string;
  format?: string;
  status?: ContentStatus;
  hook?: string;
  scriptText?: string;
  visualNotes?: string;
  cta?: string;
  source?: string;
  publishDate?: string | null;
  linkedPhilosophyConceptId?: string;
  linkedProductId?: string;
  notes?: string;
};

export type ProductDraftInput = {
  name: string;
  category: ProductCategory;
  status?: ProductStatus;
  previewImageUrl?: string;
  concept?: string;
  target?: string;
  useCase?: string;
  colors?: string;
  materials?: string;
  fit?: string;
  designDetails?: string;
  logoPlacement?: string;
  patchDetails?: string;
  accessories?: string;
  techPackStatus?: TechPackStatus;
  techPackFileUrl?: string;
  notes?: string;
  nextAction?: string;
};

export type ConceptDraftInput = {
  title: string;
  description?: string;
  type: PhilosophyType;
  pillar: SharkmoPillar;
  source?: string;
  quote?: string;
  sharkmoMeaning?: string;
  possibleContentIdea?: string;
  possibleProductIdea?: string;
  status?: PhilosophyStatus;
  notes?: string;
};

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function todayKey(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

function normalizeState(parsed: Partial<SharkmoState>): SharkmoState {
  return {
    contents: Array.isArray(parsed.contents) ? parsed.contents : sharkmoInitialState.contents,
    products: Array.isArray(parsed.products) ? parsed.products : sharkmoInitialState.products,
    concepts: Array.isArray(parsed.concepts) ? parsed.concepts : sharkmoInitialState.concepts,
    performances: Array.isArray(parsed.performances) ? parsed.performances : sharkmoInitialState.performances,
    events: Array.isArray(parsed.events) ? parsed.events : sharkmoInitialState.events,
    dailyPriorities: Array.isArray(parsed.dailyPriorities) ? parsed.dailyPriorities : [],
  };
}

function readState() {
  if (typeof window === "undefined") return sharkmoInitialState;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return sharkmoInitialState;

  try {
    return normalizeState(JSON.parse(raw) as Partial<SharkmoState>);
  } catch {
    return sharkmoInitialState;
  }
}

function getContentEventType(fromStatus: ContentStatus, toStatus: ContentStatus) {
  if (fromStatus === "Idea" && toStatus === "Script") return "IDEA_TRANSFORMED";
  if (toStatus === "Registrato") return "CONTENT_RECORDED";
  if (toStatus === "Editato") return "CONTENT_EDITED";
  if (toStatus === "Pubblicato") return "CONTENT_PUBLISHED";
  if (toStatus === "Performance") return "CONTENT_TO_PERFORMANCE";
  return "CONTENT_STATUS_CHANGED";
}

function isProductAdvance(fromStatus: ProductStatus, toStatus: ProductStatus) {
  return productFlow.indexOf(toStatus) > productFlow.indexOf(fromStatus);
}

function createContentFromInput(input: ContentDraftInput, now: string): ContentItem {
  return {
    id: createId("content"),
    title: input.title,
    description: input.description ?? "",
    category: input.category,
    pillar: input.pillar,
    platform: input.platform ?? "Instagram / TikTok",
    format: input.format ?? "Reel",
    status: input.status ?? "Idea",
    hook: input.hook ?? "",
    scriptText: input.scriptText ?? "",
    visualNotes: input.visualNotes ?? "",
    cta: input.cta ?? "",
    source: input.source ?? "",
    publishDate: input.publishDate ?? null,
    createdAt: now,
    updatedAt: now,
    lastStatusChangeAt: now,
    linkedPhilosophyConceptId: input.linkedPhilosophyConceptId,
    linkedProductId: input.linkedProductId,
    notes: input.notes ?? "",
  };
}

function createProductFromInput(input: ProductDraftInput, now: string): ProductItem {
  return {
    id: createId("product"),
    name: input.name,
    category: input.category,
    status: input.status ?? "Idea",
    previewImageUrl: input.previewImageUrl ?? "",
    concept: input.concept ?? "",
    target: input.target ?? "",
    useCase: input.useCase ?? "",
    colors: input.colors ?? "",
    materials: input.materials ?? "",
    fit: input.fit ?? "",
    designDetails: input.designDetails ?? "",
    logoPlacement: input.logoPlacement ?? "",
    patchDetails: input.patchDetails ?? "",
    accessories: input.accessories ?? "",
    techPackStatus: input.techPackStatus ?? "Mancante",
    techPackFileUrl: input.techPackFileUrl ?? "",
    mockupFiles: [],
    referenceImages: [],
    notes: input.notes ?? "",
    nextAction: input.nextAction ?? "",
    createdAt: now,
    updatedAt: now,
    lastStatusChangeAt: now,
  };
}

function createConceptFromInput(input: ConceptDraftInput, now: string): PhilosophyConcept {
  return {
    id: createId("philosophy"),
    title: input.title,
    description: input.description ?? "",
    type: input.type,
    pillar: input.pillar,
    source: input.source ?? "",
    quote: input.quote ?? "",
    sharkmoMeaning: input.sharkmoMeaning ?? "",
    possibleContentIdea: input.possibleContentIdea ?? "",
    possibleProductIdea: input.possibleProductIdea ?? "",
    status: input.status ?? "Salvato",
    createdAt: now,
    updatedAt: now,
    notes: input.notes ?? "",
  };
}

function createEmptyPerformance(content: ContentItem, now: string): PerformanceEntry {
  return {
    id: createId("performance"),
    contentItemId: content.id,
    platform: content.platform,
    publishedAt: content.publishDate ?? now,
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    followersGained: 0,
    averageWatchTime: "",
    retention: "",
    notes: "",
    whatWorked: "",
    whatToImprove: "",
    finalJudgement: "",
    createdAt: now,
    updatedAt: now,
  };
}

function getTodaysPriorities(current: SharkmoState, now = new Date()) {
  const date = todayKey(now);
  return current.dailyPriorities.filter((priority) => priority.createdForDate === date);
}

function regenerateDailyPrioritiesForState(current: SharkmoState, now = new Date()): SharkmoPriority[] {
  return generateSharkmoDailyPriorities({
    contents: current.contents.filter((item) => item.status !== "Archiviato"),
    products: current.products.filter((item) => item.status !== "Archiviato"),
    concepts: current.concepts.filter((item) => item.status !== "Archiviato"),
    performances: current.performances,
    events: current.events,
    now,
  });
}

export function useSharkmoStore() {
  const [state, setState] = useState<SharkmoState>(sharkmoInitialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(readState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [ready, state]);

  useEffect(() => {
    if (!ready) return;
    setState((current) => {
      if (getTodaysPriorities(current).length > 0) return current;
      const generated = regenerateDailyPrioritiesForState(current);
      return {
        ...current,
        dailyPriorities: [
          ...current.dailyPriorities.filter((priority) => priority.createdForDate !== todayKey()),
          ...generated,
        ],
      };
    });
  }, [ready]);

  const createContent = useCallback((input: ContentDraftInput) => {
    const now = new Date().toISOString();
    const content = createContentFromInput(input, now);

    setState((current) => ({
      ...current,
      contents: [content, ...current.contents],
      events: [
        createSharkmoEvent({
          type: "CONTENT_CREATED",
          area: "Content Studio",
          entityType: "content",
          entityId: content.id,
          title: `${content.title}: creato`,
          description: `Creato contenuto in stato ${content.status}.`,
          toStatus: content.status,
        }),
        ...current.events,
      ],
    }));

    return content.id;
  }, []);

  const updateContent = useCallback((content: ContentItem) => {
    const now = new Date().toISOString();
    setState((current) => {
      const previous = current.contents.find((item) => item.id === content.id);
      if (!previous) return current;
      const statusChanged = previous.status !== content.status;
      const events = statusChanged ? [
        createSharkmoEvent({
          type: getContentEventType(previous.status, content.status),
          area: content.status === "Performance" ? "Performance" : "Content Studio",
          entityType: "content",
          entityId: content.id,
          title: `${content.title}: ${content.status}`,
          description: `Cambio stato contenuto da ${previous.status} a ${content.status}.`,
          fromStatus: previous.status,
          toStatus: content.status,
        }),
      ] : [
        createSharkmoEvent({
          type: "CONTENT_STATUS_CHANGED",
          area: "Content Studio",
          entityType: "content",
          entityId: content.id,
          title: `${content.title}: modificato`,
          description: "Aggiornate informazioni contenuto.",
        }),
      ];

      return {
        ...current,
        contents: current.contents.map((item) => item.id === content.id ? {
          ...content,
          updatedAt: now,
          lastStatusChangeAt: statusChanged ? now : item.lastStatusChangeAt,
        } : item),
        events: [...events, ...current.events],
      };
    });
  }, []);

  const updateContentStatus = useCallback((contentId: string, toStatus: ContentStatus) => {
    const now = new Date().toISOString();

    setState((current) => {
      const content = current.contents.find((item) => item.id === contentId);
      if (!content || content.status === toStatus) return current;

      const eventType = getContentEventType(content.status, toStatus);
      const events = [
        createSharkmoEvent({
          type: eventType,
          area: eventType === "CONTENT_TO_PERFORMANCE" ? "Performance" : "Content Studio",
          entityType: "content",
          entityId: contentId,
          title: `${content.title}: ${toStatus}`,
          description: `Cambio stato contenuto da ${content.status} a ${toStatus}.`,
          fromStatus: content.status,
          toStatus,
        }),
      ];

      let performances = current.performances;
      if (toStatus === "Performance" && !performances.some((entry) => entry.contentItemId === contentId)) {
        const performance = createEmptyPerformance(content, now);
        performances = [performance, ...performances];
        events.push(createSharkmoEvent({
          type: "PERFORMANCE_CREATED",
          area: "Performance",
          entityType: "performance",
          entityId: performance.id,
          title: `${content.title}: scheda performance creata`,
          description: "Creata scheda performance collegata al contenuto.",
        }));
      }

      return {
        ...current,
        contents: current.contents.map((item) => (
          item.id === contentId
            ? {
              ...item,
              status: toStatus,
              updatedAt: now,
              lastStatusChangeAt: now,
              publishDate: toStatus === "Pubblicato" && !item.publishDate ? now : item.publishDate,
            }
            : item
        )),
        performances,
        events: [...events, ...current.events],
      };
    });
  }, []);

  const advanceContent = useCallback((contentId: string) => {
    setState((current) => {
      const content = current.contents.find((item) => item.id === contentId);
      if (!content) return current;
      const next = contentFlow[contentFlow.indexOf(content.status) + 1];
      if (!next) return current;

      const now = new Date().toISOString();
      const eventType = getContentEventType(content.status, next);
      return {
        ...current,
        contents: current.contents.map((item) => item.id === contentId ? {
          ...item,
          status: next,
          updatedAt: now,
          lastStatusChangeAt: now,
        } : item),
        events: [
          createSharkmoEvent({
            type: eventType,
            area: eventType === "CONTENT_TO_PERFORMANCE" ? "Performance" : "Content Studio",
            entityType: "content",
            entityId: content.id,
            title: `${content.title}: ${next}`,
            description: `Cambio stato contenuto da ${content.status} a ${next}.`,
            fromStatus: content.status,
            toStatus: next,
          }),
          ...current.events,
        ],
      };
    });
  }, []);

  const archiveContent = useCallback((contentId: string) => updateContentStatus(contentId, "Archiviato"), [updateContentStatus]);

  const deleteContent = useCallback((contentId: string) => {
    const now = new Date().toISOString();
    setState((current) => {
      const content = current.contents.find((item) => item.id === contentId);
      if (!content) return current;

      return {
        ...current,
        contents: current.contents.filter((item) => item.id !== contentId),
        dailyPriorities: current.dailyPriorities.filter((priority) => priority.entityId !== contentId),
        events: [
          createSharkmoEvent({
            type: "CONTENT_DELETED",
            area: "Content Studio",
            entityType: "content",
            entityId: contentId,
            title: `${content.title}: eliminato`,
            description: `Contenuto eliminato definitivamente il ${new Date(now).toLocaleDateString("it-IT")}.`,
          }),
          ...current.events,
        ],
      };
    });
  }, []);

  const scheduleContent = useCallback((contentId: string, publishDate: string, platform: string) => {
    const now = new Date().toISOString();

    setState((current) => {
      const content = current.contents.find((item) => item.id === contentId);
      if (!content) return current;

      return {
        ...current,
        contents: current.contents.map((item) => (
          item.id === contentId
            ? { ...item, platform, publishDate, status: "Programmato", updatedAt: now, lastStatusChangeAt: item.status === "Programmato" ? item.lastStatusChangeAt : now }
            : item
        )),
        events: [
          createSharkmoEvent({
            type: "CONTENT_STATUS_CHANGED",
            area: "Content Studio",
            entityType: "content",
            entityId: contentId,
            title: `${content.title}: programmato`,
            description: `Contenuto programmato per ${new Date(publishDate).toLocaleString("it-IT")}.`,
            fromStatus: content.status,
            toStatus: "Programmato",
          }),
          ...current.events,
        ],
      };
    });
  }, []);

  const unscheduleContent = useCallback((contentId: string) => {
    const now = new Date().toISOString();
    setState((current) => {
      const content = current.contents.find((item) => item.id === contentId);
      if (!content) return current;

      return {
        ...current,
        contents: current.contents.map((item) => item.id === contentId ? {
          ...item,
          status: "Editato",
          publishDate: null,
          updatedAt: now,
          lastStatusChangeAt: now,
        } : item),
        events: [
          createSharkmoEvent({
            type: "CONTENT_STATUS_CHANGED",
            area: "Content Studio",
            entityType: "content",
            entityId: contentId,
            title: `${content.title}: programmazione annullata`,
            description: "Programmazione rimossa, contenuto tornato in Editato.",
            fromStatus: content.status,
            toStatus: "Editato",
          }),
          ...current.events,
        ],
      };
    });
  }, []);

  const createProduct = useCallback((input: ProductDraftInput) => {
    const now = new Date().toISOString();
    const product = createProductFromInput(input, now);

    setState((current) => ({
      ...current,
      products: [product, ...current.products],
      events: [
        createSharkmoEvent({
          type: "PRODUCT_CREATED",
          area: "Product Lab",
          entityType: "product",
          entityId: product.id,
          title: `${product.name}: creato`,
          description: `Creato prodotto in stato ${product.status}.`,
          toStatus: product.status,
        }),
        ...current.events,
      ],
    }));

    return product.id;
  }, []);

  const updateProduct = useCallback((product: ProductItem) => {
    const now = new Date().toISOString();
    setState((current) => {
      const previous = current.products.find((item) => item.id === product.id);
      if (!previous) return current;
      const statusChanged = previous.status !== product.status;

      return {
        ...current,
        products: current.products.map((item) => item.id === product.id ? {
          ...product,
          updatedAt: now,
          lastStatusChangeAt: statusChanged ? now : item.lastStatusChangeAt,
        } : item),
        events: [
          createSharkmoEvent({
            type: statusChanged ? (isProductAdvance(previous.status, product.status) ? "PRODUCT_ADVANCED" : "PRODUCT_STATUS_CHANGED") : "PRODUCT_UPDATED",
            area: "Product Lab",
            entityType: "product",
            entityId: product.id,
            title: `${product.name}: ${statusChanged ? product.status : "modificato"}`,
            description: statusChanged ? `Cambio stato prodotto da ${previous.status} a ${product.status}.` : "Aggiornate informazioni prodotto.",
            fromStatus: statusChanged ? previous.status : undefined,
            toStatus: statusChanged ? product.status : undefined,
          }),
          ...current.events,
        ],
      };
    });
  }, []);

  const updateProductStatus = useCallback((productId: string, toStatus: ProductStatus) => {
    const now = new Date().toISOString();
    setState((current) => {
      const product = current.products.find((item) => item.id === productId);
      if (!product || product.status === toStatus) return current;
      const advanced = isProductAdvance(product.status, toStatus);

      const events = [
        createSharkmoEvent({
          type: advanced ? "PRODUCT_ADVANCED" : "PRODUCT_STATUS_CHANGED",
          area: "Product Lab",
          entityType: "product",
          entityId: productId,
          title: `${product.name}: ${toStatus}`,
          description: `Cambio stato prodotto da ${product.status} a ${toStatus}.`,
          fromStatus: product.status,
          toStatus,
        }),
      ];

      if (toStatus === "Tech pack completato") {
        events.push(createSharkmoEvent({
          type: "TECH_PACK_COMPLETED",
          area: "Product Lab",
          entityType: "product",
          entityId: productId,
          title: `${product.name}: tech pack completato`,
          description: "Tech pack segnato come completato.",
        }));
      }

      return {
        ...current,
        products: current.products.map((item) => (
          item.id === productId
            ? {
              ...item,
              status: toStatus,
              techPackStatus: toStatus === "Tech pack completato" ? "Completato" : item.techPackStatus,
              updatedAt: now,
              lastStatusChangeAt: now,
            }
            : item
        )),
        events: [...events, ...current.events],
      };
    });
  }, []);

  const updateTechPackStatus = useCallback((productId: string, techPackStatus: TechPackStatus, fileUrl?: string) => {
    const now = new Date().toISOString();
    setState((current) => {
      const product = current.products.find((item) => item.id === productId);
      if (!product) return current;

      return {
        ...current,
        products: current.products.map((item) => (
          item.id === productId
            ? {
              ...item,
              techPackStatus,
              techPackFileUrl: fileUrl ?? item.techPackFileUrl,
              updatedAt: now,
              lastStatusChangeAt: techPackStatus === item.techPackStatus ? item.lastStatusChangeAt : now,
            }
            : item
        )),
        events: [
          createSharkmoEvent({
            type: techPackStatus === "Completato" ? "TECH_PACK_COMPLETED" : "FILE_UPLOADED",
            area: "Product Lab",
            entityType: "product",
            entityId: productId,
            title: `${product.name}: tech pack ${techPackStatus.toLowerCase()}`,
            description: fileUrl ? `File simulato: ${fileUrl}` : `Tech pack status aggiornato a ${techPackStatus}.`,
          }),
          ...current.events,
        ],
      };
    });
  }, []);

  const archiveProduct = useCallback((productId: string) => updateProductStatus(productId, "Archiviato"), [updateProductStatus]);

  const advanceProduct = useCallback((productId: string) => {
    setState((current) => {
      const product = current.products.find((item) => item.id === productId);
      if (!product) return current;
      const next = productFlow[productFlow.indexOf(product.status) + 1];
      if (!next) return current;
      const now = new Date().toISOString();

      return {
        ...current,
        products: current.products.map((item) => item.id === productId ? {
          ...item,
          status: next,
          techPackStatus: next === "Tech pack completato" ? "Completato" : item.techPackStatus,
          updatedAt: now,
          lastStatusChangeAt: now,
        } : item),
        events: [
          createSharkmoEvent({
            type: "PRODUCT_ADVANCED",
            area: "Product Lab",
            entityType: "product",
            entityId: productId,
            title: `${product.name}: ${next}`,
            description: `Cambio stato prodotto da ${product.status} a ${next}.`,
            fromStatus: product.status,
            toStatus: next,
          }),
          ...current.events,
        ],
      };
    });
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setState((current) => {
      const product = current.products.find((item) => item.id === productId);
      if (!product) return current;

      return {
        ...current,
        products: current.products.filter((item) => item.id !== productId),
        concepts: current.concepts.map((concept) => concept.transformedIntoProductId === productId ? { ...concept, transformedIntoProductId: undefined } : concept),
        dailyPriorities: current.dailyPriorities.filter((priority) => priority.entityId !== productId),
        events: [
          createSharkmoEvent({
            type: "PRODUCT_DELETED",
            area: "Product Lab",
            entityType: "product",
            entityId: productId,
            title: `${product.name}: eliminato`,
            description: "Prodotto eliminato definitivamente.",
          }),
          ...current.events,
        ],
      };
    });
  }, []);

  const createConcept = useCallback((input: ConceptDraftInput) => {
    const now = new Date().toISOString();
    const concept = createConceptFromInput(input, now);

    setState((current) => ({
      ...current,
      concepts: [concept, ...current.concepts],
      events: [
        createSharkmoEvent({
          type: "PHILOSOPHY_CREATED",
          area: "Filosofia",
          entityType: "philosophy",
          entityId: concept.id,
          title: `${concept.title}: creato`,
          description: "Nuovo concetto aggiunto alla Brand Intelligence.",
          toStatus: concept.status,
        }),
        ...current.events,
      ],
    }));

    return concept.id;
  }, []);

  const updateConcept = useCallback((concept: PhilosophyConcept) => {
    const now = new Date().toISOString();
    setState((current) => ({
      ...current,
      concepts: current.concepts.map((item) => item.id === concept.id ? { ...concept, updatedAt: now } : item),
      events: [
        createSharkmoEvent({
          type: "PHILOSOPHY_CREATED",
          area: "Filosofia",
          entityType: "philosophy",
          entityId: concept.id,
          title: `${concept.title}: modificato`,
          description: "Concetto aggiornato.",
        }),
        ...current.events,
      ],
    }));
  }, []);

  const archiveConcept = useCallback((conceptId: string) => {
    const now = new Date().toISOString();
    setState((current) => {
      const concept = current.concepts.find((item) => item.id === conceptId);
      if (!concept) return current;
      return {
        ...current,
        concepts: current.concepts.map((item) => item.id === conceptId ? { ...item, status: "Archiviato", updatedAt: now } : item),
        events: [
          createSharkmoEvent({
            type: "PHILOSOPHY_TRANSFORMED",
            area: "Filosofia",
            entityType: "philosophy",
            entityId: conceptId,
            title: `${concept.title}: archiviato`,
            description: "Concetto archiviato.",
            fromStatus: concept.status,
            toStatus: "Archiviato",
          }),
          ...current.events,
        ],
      };
    });
  }, []);

  const deleteConcept = useCallback((conceptId: string) => {
    setState((current) => {
      const concept = current.concepts.find((item) => item.id === conceptId);
      if (!concept) return current;
      return {
        ...current,
        concepts: current.concepts.filter((item) => item.id !== conceptId),
        dailyPriorities: current.dailyPriorities.filter((priority) => priority.entityId !== conceptId),
        events: [
          createSharkmoEvent({
            type: "PHILOSOPHY_DELETED",
            area: "Filosofia",
            entityType: "philosophy",
            entityId: conceptId,
            title: `${concept.title}: eliminato`,
            description: "Concetto eliminato definitivamente.",
          }),
          ...current.events,
        ],
      };
    });
  }, []);

  const transformConceptToIdea = useCallback((conceptId: string) => {
    const now = new Date().toISOString();
    setState((current) => {
      const concept = current.concepts.find((item) => item.id === conceptId);
      if (!concept) return current;
      const content = createContentFromInput({
        title: concept.possibleContentIdea || concept.title,
        description: concept.sharkmoMeaning || concept.description,
        category: "Filosofia / Messaggi",
        pillar: concept.pillar,
        status: "Idea",
        hook: concept.quote,
        source: concept.source || concept.title,
        notes: "Creato da Filosofia / Brand Intelligence.",
        linkedPhilosophyConceptId: concept.id,
      }, now);

      return {
        ...current,
        contents: [content, ...current.contents],
        concepts: current.concepts.map((item) => item.id === conceptId ? { ...item, status: "Trasformato in idea", transformedIntoContentId: content.id, updatedAt: now } : item),
        events: [
          createSharkmoEvent({
            type: "PHILOSOPHY_TRANSFORMED",
            area: "Filosofia",
            entityType: "philosophy",
            entityId: conceptId,
            title: `${concept.title}: trasformato in idea`,
            description: "Concetto trasformato in idea contenuto.",
            fromStatus: concept.status,
            toStatus: "Trasformato in idea",
          }),
          createSharkmoEvent({
            type: "CONTENT_CREATED",
            area: "Content Studio",
            entityType: "content",
            entityId: content.id,
            title: `${content.title}: creato`,
            description: "Idea creata da un concetto filosofia.",
            toStatus: "Idea",
          }),
          ...current.events,
        ],
      };
    });
  }, []);

  const transformConceptToScript = useCallback((conceptId: string) => {
    const now = new Date().toISOString();
    setState((current) => {
      const concept = current.concepts.find((item) => item.id === conceptId);
      if (!concept) return current;
      const content = createContentFromInput({
        title: concept.possibleContentIdea || concept.title,
        description: concept.sharkmoMeaning || concept.description,
        category: "Filosofia / Messaggi",
        pillar: concept.pillar,
        platform: "Instagram / TikTok",
        format: "Reel",
        status: "Script",
        hook: concept.quote,
        scriptText: concept.description || concept.sharkmoMeaning,
        cta: "KeepMoving.",
        source: concept.source || concept.title,
        linkedPhilosophyConceptId: concept.id,
        notes: "Creato da Filosofia / Brand Intelligence.",
      }, now);

      return {
        ...current,
        contents: [content, ...current.contents],
        concepts: current.concepts.map((item) => item.id === conceptId ? { ...item, status: "Trasformato in script", transformedIntoContentId: content.id, updatedAt: now } : item),
        events: [
          createSharkmoEvent({
            type: "PHILOSOPHY_TRANSFORMED",
            area: "Filosofia",
            entityType: "philosophy",
            entityId: conceptId,
            title: `${concept.title}: trasformato in script`,
            description: "Concetto trasformato in contenuto/script.",
            fromStatus: concept.status,
            toStatus: "Trasformato in script",
          }),
          createSharkmoEvent({
            type: "CONTENT_CREATED",
            area: "Content Studio",
            entityType: "content",
            entityId: content.id,
            title: `${content.title}: script creato`,
            description: "Script creato da un concetto filosofia.",
            toStatus: "Script",
          }),
          ...current.events,
        ],
      };
    });
  }, []);

  const linkConceptToProduct = useCallback((conceptId: string, productId: string) => {
    const now = new Date().toISOString();
    setState((current) => {
      const concept = current.concepts.find((item) => item.id === conceptId);
      const product = current.products.find((item) => item.id === productId);
      if (!concept || !product) return current;

      return {
        ...current,
        concepts: current.concepts.map((item) => item.id === conceptId ? {
          ...item,
          transformedIntoProductId: productId,
          status: "Trasformato in prodotto",
          updatedAt: now,
        } : item),
        events: [
          createSharkmoEvent({
            type: "PHILOSOPHY_TRANSFORMED",
            area: "Filosofia",
            entityType: "philosophy",
            entityId: conceptId,
            title: `${concept.title}: collegato a ${product.name}`,
            description: "Concetto collegato a un prodotto esistente.",
            fromStatus: concept.status,
            toStatus: "Trasformato in prodotto",
          }),
          ...current.events,
        ],
      };
    });
  }, []);

  const createPerformanceForContent = useCallback((contentId: string) => {
    const now = new Date().toISOString();

    setState((current) => {
      const content = current.contents.find((item) => item.id === contentId);
      if (!content) return current;

      const existing = current.performances.find((entry) => entry.contentItemId === contentId);
      const nextStatus = content.status === "Performance" ? content.status : "Performance";
      const events = [];
      let performances = current.performances;

      if (content.status !== "Performance") {
        events.push(createSharkmoEvent({
          type: "CONTENT_TO_PERFORMANCE",
          area: "Performance",
          entityType: "content",
          entityId: contentId,
          title: `${content.title}: spostato in Performance`,
          description: `Cambio stato contenuto da ${content.status} a Performance.`,
          fromStatus: content.status,
          toStatus: "Performance",
        }));
      }

      if (!existing) {
        const performance = createEmptyPerformance(content, now);
        performances = [performance, ...performances];
        events.push(createSharkmoEvent({
          type: "PERFORMANCE_CREATED",
          area: "Performance",
          entityType: "performance",
          entityId: performance.id,
          title: `${content.title}: scheda performance creata`,
          description: "Creata scheda performance collegata al contenuto.",
        }));
      }

      return {
        ...current,
        contents: current.contents.map((item) => (
          item.id === contentId
            ? { ...item, status: nextStatus, updatedAt: now, lastStatusChangeAt: content.status === nextStatus ? item.lastStatusChangeAt : now }
            : item
        )),
        performances,
        events: [...events, ...current.events],
      };
    });
  }, []);

  const updatePerformance = useCallback((entry: PerformanceEntry) => {
    const now = new Date().toISOString();
    setState((current) => ({
      ...current,
      performances: current.performances.map((item) => item.id === entry.id ? { ...entry, updatedAt: now } : item),
      events: [
        createSharkmoEvent({
          type: "PERFORMANCE_UPDATED",
          area: "Performance",
          entityType: "performance",
          entityId: entry.id,
          title: "Performance aggiornata",
          description: "Metriche e note qualitative aggiornate.",
        }),
        ...current.events,
      ],
    }));
  }, []);

  const deletePerformance = useCallback((performanceId: string) => {
    setState((current) => {
      const performance = current.performances.find((item) => item.id === performanceId);
      if (!performance) return current;
      const content = current.contents.find((item) => item.id === performance.contentItemId);

      return {
        ...current,
        performances: current.performances.filter((item) => item.id !== performanceId),
        contents: current.contents.map((item) => item.id === performance.contentItemId && item.status === "Performance" ? { ...item, status: "Pubblicato", updatedAt: new Date().toISOString() } : item),
        events: [
          createSharkmoEvent({
            type: "PERFORMANCE_DELETED",
            area: "Performance",
            entityType: "performance",
            entityId: performanceId,
            title: `${content?.title ?? "Performance"}: eliminata`,
            description: "Performance eliminata. Il contenuto collegato resta pubblicato.",
          }),
          ...current.events,
        ],
      };
    });
  }, []);

  const completeDailyPriority = useCallback((priorityId: string) => {
    const now = new Date().toISOString();
    setState((current) => {
      const priority = current.dailyPriorities.find((item) => item.id === priorityId);
      if (!priority || priority.completed) return current;

      return {
        ...current,
        dailyPriorities: current.dailyPriorities.map((item) => item.id === priorityId ? { ...item, completed: true, completedAt: now } : item),
        events: [
          createSharkmoEvent({
            type: "PRIORITY_COMPLETED",
            area: priority.area,
            entityType: priority.entityType,
            entityId: priority.entityId,
            title: `${priority.title}: completata`,
            description: priority.reason,
          }),
          ...current.events,
        ],
      };
    });
  }, []);

  const regenerateDailyPriorities = useCallback(() => {
    setState((current) => {
      const generated = regenerateDailyPrioritiesForState(current);
      return {
        ...current,
        dailyPriorities: [
          ...current.dailyPriorities.filter((priority) => priority.createdForDate !== todayKey()),
          ...generated,
        ],
      };
    });
  }, []);

  const getOrCreateDailyPriorities = useCallback(() => getTodaysPriorities(state), [state]);

  const activeContents = useMemo(() => state.contents.filter((item) => item.status !== "Archiviato"), [state.contents]);
  const activeProducts = useMemo(() => state.products.filter((item) => item.status !== "Archiviato"), [state.products]);
  const activeConcepts = useMemo(() => state.concepts.filter((item) => item.status !== "Archiviato"), [state.concepts]);

  return {
    ready,
    state,
    activeContents,
    activeProducts,
    activeConcepts,
    createContent,
    updateContent,
    deleteContent,
    archiveContent,
    advanceContent,
    scheduleContent,
    unscheduleContent,
    updateContentStatus,
    createProduct,
    updateProduct,
    deleteProduct,
    archiveProduct,
    advanceProduct,
    updateProductStatus,
    updateTechPackStatus,
    createConcept,
    updateConcept,
    deleteConcept,
    archiveConcept,
    transformConceptToIdea,
    transformConceptToScript,
    linkConceptToProduct,
    updatePerformance,
    deletePerformance,
    createPerformanceForContent,
    getOrCreateDailyPriorities,
    completeDailyPriority,
    regenerateDailyPriorities,
  };
}
