export type SharkmoArea = "Content Studio" | "Product Lab" | "Filosofia" | "Performance";

export type SharkmoPillar =
  | "Movimento"
  | "Istinto controllato"
  | "Evoluzione personale"
  | "Estetica Sharkmo"
  | "Anti-burattino"
  | "Costruzione del brand";

export type ContentCategory =
  | "Dietro le quinte"
  | "Filosofia / Messaggi"
  | "Community / Interazione"
  | "Lancio / Vendita"
  | "Prodotto / Outfit"
  | "Trend adattato a Sharkmo";

export type ContentStatus =
  | "Idea"
  | "Script"
  | "Da registrare"
  | "Registrato"
  | "Da editare"
  | "Editato"
  | "Programmato"
  | "Pubblicato"
  | "Performance"
  | "Archiviato";

export type ProductStatus =
  | "Idea"
  | "Concept"
  | "Design"
  | "Mockup"
  | "Tech pack in corso"
  | "Tech pack completato"
  | "Campione richiesto"
  | "Campione ricevuto"
  | "Revisione"
  | "Pronto produzione"
  | "Archiviato";

export type ProductCategory = "Jeans" | "Felpa" | "T-shirt" | "Giacca" | "Pantaloni" | "Accessorio" | "Scarpe" | "Altro";

export type TechPackStatus = "Mancante" | "In corso" | "Allegato" | "Completato" | "Da revisionare";

export type PhilosophyType =
  | "Argomento"
  | "Frase"
  | "Concetto psicologico"
  | "Riferimento filosofico"
  | "Simbolo"
  | "Libro / Fonte"
  | "Competitor"
  | "Trend"
  | "Valore brand";

export type PhilosophyStatus =
  | "Salvato"
  | "Da sviluppare"
  | "Pronto per script"
  | "Trasformato in idea"
  | "Trasformato in script"
  | "Trasformato in prodotto"
  | "Archiviato";

export type SharkmoEventType =
  | "CONTENT_CREATED"
  | "CONTENT_DELETED"
  | "CONTENT_STATUS_CHANGED"
  | "CONTENT_RECORDED"
  | "CONTENT_EDITED"
  | "CONTENT_PUBLISHED"
  | "CONTENT_TO_PERFORMANCE"
  | "IDEA_TRANSFORMED"
  | "PRODUCT_CREATED"
  | "PRODUCT_DELETED"
  | "PRODUCT_STATUS_CHANGED"
  | "PRODUCT_ADVANCED"
  | "PRODUCT_UPDATED"
  | "TECH_PACK_COMPLETED"
  | "PERFORMANCE_CREATED"
  | "PERFORMANCE_UPDATED"
  | "PERFORMANCE_DELETED"
  | "PHILOSOPHY_CREATED"
  | "PHILOSOPHY_DELETED"
  | "PHILOSOPHY_TRANSFORMED"
  | "PRIORITY_COMPLETED"
  | "FILE_UPLOADED";

export type EntityType = "content" | "product" | "philosophy" | "performance";

export type ContentItem = {
  id: string;
  title: string;
  description: string;
  category: ContentCategory;
  pillar: SharkmoPillar;
  platform: string;
  format: string;
  status: ContentStatus;
  hook: string;
  scriptText: string;
  visualNotes: string;
  cta: string;
  source: string;
  publishDate: string | null;
  createdAt: string;
  updatedAt: string;
  lastStatusChangeAt: string;
  linkedPhilosophyConceptId?: string;
  linkedProductId?: string;
  notes: string;
};

export type ProductItem = {
  id: string;
  name: string;
  category: ProductCategory;
  status: ProductStatus;
  previewImageUrl: string;
  concept: string;
  target: string;
  useCase: string;
  colors: string;
  materials: string;
  fit: string;
  designDetails: string;
  logoPlacement: string;
  patchDetails: string;
  accessories: string;
  techPackStatus: TechPackStatus;
  techPackFileUrl: string;
  mockupFiles: string[];
  referenceImages: string[];
  notes: string;
  nextAction: string;
  createdAt: string;
  updatedAt: string;
  lastStatusChangeAt: string;
};

export type PhilosophyConcept = {
  id: string;
  title: string;
  description: string;
  type: PhilosophyType;
  pillar: SharkmoPillar;
  source: string;
  quote: string;
  sharkmoMeaning: string;
  possibleContentIdea: string;
  possibleProductIdea: string;
  status: PhilosophyStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  transformedIntoContentId?: string;
  transformedIntoProductId?: string;
};

export type PerformanceEntry = {
  id: string;
  contentItemId: string;
  platform: string;
  publishedAt: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  followersGained: number;
  averageWatchTime?: string;
  retention?: string;
  notes: string;
  whatWorked: string;
  whatToImprove: string;
  finalJudgement: string;
  createdAt: string;
  updatedAt: string;
};

export type SharkmoEvent = {
  id: string;
  type: SharkmoEventType;
  area: SharkmoArea;
  entityType: EntityType;
  entityId: string;
  title: string;
  description: string;
  fromStatus?: string;
  toStatus?: string;
  createdAt: string;
};

export type SharkmoPriority = {
  id: string;
  title: string;
  area: SharkmoArea;
  reason: string;
  entityType: EntityType;
  entityId: string;
  suggestedAction: string;
  score: number;
  completed: boolean;
  createdForDate: string;
  completedAt?: string;
};

export type SharkmoState = {
  contents: ContentItem[];
  products: ProductItem[];
  concepts: PhilosophyConcept[];
  performances: PerformanceEntry[];
  events: SharkmoEvent[];
  dailyPriorities: SharkmoPriority[];
};
