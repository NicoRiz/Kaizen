"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { sharkmoInitialState } from "@/lib/sharkmo/data";
import { createSharkmoEvent } from "@/lib/sharkmo/tracking";
import type {
  ContentItem,
  ContentStatus,
  PerformanceEntry,
  PhilosophyConcept,
  ProductItem,
  ProductStatus,
  SharkmoState,
  TechPackStatus,
} from "@/lib/sharkmo/types";

const STORAGE_KEY = "sharkmo-operating-state-v1";

const contentFlow: ContentStatus[] = ["Idea", "Script", "Da registrare", "Registrato", "Da editare", "Editato", "Programmato", "Pubblicato", "Performance"];
const productFlow: ProductStatus[] = ["Idea", "Concept", "Design", "Mockup", "Tech pack in corso", "Tech pack completato", "Campione richiesto", "Campione ricevuto", "Revisione", "Pronto produzione"];

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeState(parsed: Partial<SharkmoState>): SharkmoState {
  return {
    contents: Array.isArray(parsed.contents) ? parsed.contents : sharkmoInitialState.contents,
    products: Array.isArray(parsed.products) ? parsed.products : sharkmoInitialState.products,
    concepts: Array.isArray(parsed.concepts) ? parsed.concepts : sharkmoInitialState.concepts,
    performances: Array.isArray(parsed.performances) ? parsed.performances : sharkmoInitialState.performances,
    events: Array.isArray(parsed.events) ? parsed.events : sharkmoInitialState.events,
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
    notes: "",
    whatWorked: "",
    whatToImprove: "",
    finalJudgement: "",
    createdAt: now,
    updatedAt: now,
  };
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

  const updateContentStatus = useCallback((contentId: string, toStatus: ContentStatus) => {
    const now = new Date().toISOString();

    setState((current) => {
      const content = current.contents.find((item) => item.id === contentId);
      if (!content || content.status === toStatus) return current;

      const eventType = getContentEventType(content.status, toStatus);
      const event = createSharkmoEvent({
        type: eventType,
        area: eventType === "CONTENT_TO_PERFORMANCE" ? "Performance" : "Content Studio",
        entityType: "content",
        entityId: contentId,
        title: `${content.title}: ${toStatus}`,
        description: `Cambio stato contenuto da ${content.status} a ${toStatus}.`,
        fromStatus: content.status,
        toStatus,
      });

      let performances = current.performances;
      const events = [event];
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

  const advanceContent = useCallback((contentId: string) => {
    const content = state.contents.find((item) => item.id === contentId);
    if (!content) return;
    const next = contentFlow[contentFlow.indexOf(content.status) + 1];
    if (next) updateContentStatus(contentId, next);
  }, [state.contents, updateContentStatus]);

  const scheduleContent = useCallback((contentId: string, publishDate: string, platform: string) => {
    const now = new Date().toISOString();

    setState((current) => {
      const content = current.contents.find((item) => item.id === contentId);
      if (!content) return current;

      const event = createSharkmoEvent({
        type: "CONTENT_STATUS_CHANGED",
        area: "Content Studio",
        entityType: "content",
        entityId: contentId,
        title: `${content.title}: programmato`,
        description: `Contenuto programmato per ${new Date(publishDate).toLocaleString("it-IT")}.`,
        fromStatus: content.status,
        toStatus: "Programmato",
      });

      return {
        ...current,
        contents: current.contents.map((item) => (
          item.id === contentId
            ? { ...item, platform, publishDate, status: "Programmato", updatedAt: now, lastStatusChangeAt: now }
            : item
        )),
        events: [event, ...current.events],
      };
    });
  }, []);

  const updateProduct = useCallback((product: ProductItem) => {
    const now = new Date().toISOString();
    setState((current) => ({
      ...current,
      products: current.products.map((item) => item.id === product.id ? { ...product, updatedAt: now } : item),
      events: [
        createSharkmoEvent({
          type: "PRODUCT_UPDATED",
          area: "Product Lab",
          entityType: "product",
          entityId: product.id,
          title: `${product.name}: modificato`,
          description: "Aggiornate informazioni prodotto.",
        }),
        ...current.events,
      ],
    }));
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

      const events = [
        createSharkmoEvent({
          type: techPackStatus === "Completato" ? "TECH_PACK_COMPLETED" : "FILE_UPLOADED",
          area: "Product Lab",
          entityType: "product",
          entityId: productId,
          title: `${product.name}: tech pack ${techPackStatus.toLowerCase()}`,
          description: fileUrl ? `File simulato: ${fileUrl}` : `Tech pack status aggiornato a ${techPackStatus}.`,
        }),
      ];

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
        events: [...events, ...current.events],
      };
    });
  }, []);

  const transformConceptToScript = useCallback((conceptId: string) => {
    const now = new Date().toISOString();
    setState((current) => {
      const concept = current.concepts.find((item) => item.id === conceptId);
      if (!concept) return current;
      const contentId = createId("content");

      const content: ContentItem = {
        id: contentId,
        title: concept.possibleContentIdea || concept.title,
        description: concept.sharkmoMeaning,
        category: "Filosofia / Messaggi",
        pillar: concept.pillar,
        platform: "Instagram / TikTok",
        format: "Reel",
        status: "Script",
        hook: concept.quote,
        scriptText: concept.quote,
        visualNotes: "",
        cta: "KeepMoving.",
        source: concept.title,
        publishDate: null,
        createdAt: now,
        updatedAt: now,
        lastStatusChangeAt: now,
        linkedPhilosophyConceptId: concept.id,
        notes: "Creato da Filosofia / Brand Intelligence.",
      };

      return {
        ...current,
        contents: [content, ...current.contents],
        concepts: current.concepts.map((item) => item.id === conceptId ? { ...item, status: "Trasformato in script", transformedIntoContentId: contentId, updatedAt: now } : item),
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
          ...current.events,
        ],
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

  const activeContents = useMemo(() => state.contents.filter((item) => item.status !== "Archiviato"), [state.contents]);
  const activeProducts = useMemo(() => state.products.filter((item) => item.status !== "Archiviato"), [state.products]);
  const activeConcepts = useMemo(() => state.concepts.filter((item) => item.status !== "Archiviato"), [state.concepts]);

  return {
    ready,
    state,
    activeContents,
    activeProducts,
    activeConcepts,
    advanceContent,
    scheduleContent,
    updateContentStatus,
    updateProduct,
    updateProductStatus,
    updateTechPackStatus,
    transformConceptToScript,
    updatePerformance,
    createPerformanceForContent,
  };
}
