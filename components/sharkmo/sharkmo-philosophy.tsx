"use client";

import { useMemo, useState } from "react";
import { Brain, Plus } from "lucide-react";
import { SharkmoBadge, SharkmoButton, SharkmoField, SharkmoModal, SharkmoPanel, sharkmoInputClass } from "@/components/sharkmo/sharkmo-ui";
import type { PhilosophyConcept, PhilosophyStatus, PhilosophyType, ProductItem, SharkmoPillar } from "@/lib/sharkmo/types";
import type { ConceptDraftInput } from "@/lib/sharkmo/use-sharkmo-store";

type SharkmoPhilosophyProps = {
  concepts: PhilosophyConcept[];
  products: ProductItem[];
  selectedEntityId?: string | null;
  onCreateConcept: (input: ConceptDraftInput) => string;
  onUpdateConcept: (concept: PhilosophyConcept) => void;
  onDeleteConcept: (conceptId: string) => void;
  onArchiveConcept: (conceptId: string) => void;
  onTransformToIdea: (conceptId: string) => void;
  onTransformToScript: (conceptId: string) => void;
  onLinkToProduct: (conceptId: string, productId: string) => void;
};

const pillarDescriptions: Record<SharkmoPillar, string> = {
  Movimento: "KeepMoving, direzione, azione, disciplina, evoluzione.",
  "Istinto controllato": "Forza piu controllo, fame, lucidita, autocontrollo.",
  "Evoluzione personale": "Crescita, cambiamento, identita, abitudini.",
  "Estetica Sharkmo": "Nero, oro, bordeaux, silhouette, lusso trap elegante.",
  "Anti-burattino": "Consapevolezza, indipendenza mentale, scelta.",
  "Costruzione del brand": "Processo, prototipi, tech pack, nascita del brand.",
};

const pillars = Object.keys(pillarDescriptions) as SharkmoPillar[];
const philosophyTypes: PhilosophyType[] = ["Argomento", "Frase", "Concetto psicologico", "Riferimento filosofico", "Simbolo", "Libro / Fonte", "Competitor", "Trend", "Valore brand"];
const philosophyStatuses: PhilosophyStatus[] = ["Salvato", "Da sviluppare", "Pronto per script", "Trasformato in idea", "Trasformato in script", "Trasformato in prodotto", "Archiviato"];

const emptyConceptDraft: ConceptDraftInput = {
  title: "",
  description: "",
  type: "Argomento",
  pillar: "Movimento",
  source: "",
  quote: "",
  sharkmoMeaning: "",
  possibleContentIdea: "",
  possibleProductIdea: "",
  status: "Salvato",
  notes: "",
};

function daysSince(value: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / (24 * 60 * 60 * 1000)));
}

function isBlocked(concept: PhilosophyConcept) {
  return concept.status !== "Archiviato" && daysSince(concept.updatedAt) >= 6;
}

export function SharkmoPhilosophy({
  concepts,
  products,
  selectedEntityId,
  onCreateConcept,
  onUpdateConcept,
  onDeleteConcept,
  onArchiveConcept,
  onTransformToIdea,
  onTransformToScript,
  onLinkToProduct,
}: SharkmoPhilosophyProps) {
  const [modal, setModal] = useState<{ item?: PhilosophyConcept; draft: ConceptDraftInput } | null>(null);
  const [pillarFilter, setPillarFilter] = useState<"Tutti" | SharkmoPillar>("Tutti");
  const [typeFilter, setTypeFilter] = useState<"Tutti" | PhilosophyType>("Tutti");
  const [statusFilter, setStatusFilter] = useState<"Tutti" | PhilosophyStatus>("Tutti");
  const [productLinks, setProductLinks] = useState<Record<string, string>>({});

  const filteredConcepts = useMemo(() => concepts.filter((concept) => (
    (pillarFilter === "Tutti" || concept.pillar === pillarFilter)
    && (typeFilter === "Tutti" || concept.type === typeFilter)
    && (statusFilter === "Tutti" || concept.status === statusFilter)
  )), [concepts, pillarFilter, statusFilter, typeFilter]);

  function openCreate(pillar?: SharkmoPillar) {
    setModal({ draft: { ...emptyConceptDraft, pillar: pillar ?? "Movimento" } });
  }

  function openEdit(concept: PhilosophyConcept) {
    setModal({
      item: concept,
      draft: {
        title: concept.title,
        description: concept.description,
        type: concept.type,
        pillar: concept.pillar,
        source: concept.source,
        quote: concept.quote,
        sharkmoMeaning: concept.sharkmoMeaning,
        possibleContentIdea: concept.possibleContentIdea,
        possibleProductIdea: concept.possibleProductIdea,
        status: concept.status,
        notes: concept.notes ?? "",
      },
    });
  }

  function saveModal() {
    if (!modal || !modal.draft.title.trim()) return;
    if (modal.item) {
      onUpdateConcept({ ...modal.item, ...modal.draft, title: modal.draft.title.trim() });
    } else {
      onCreateConcept({ ...modal.draft, title: modal.draft.title.trim() });
    }
    setModal(null);
  }

  function confirmDelete(concept: PhilosophyConcept) {
    if (window.confirm("Sei sicuro di voler eliminare questo concetto?")) {
      onDeleteConcept(concept.id);
    }
  }

  return (
    <div className="space-y-5">
      <SharkmoPanel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#d29f22]">Filosofia</p>
            <h1 className="mt-3 text-3xl font-semibold text-zinc-50">Filosofia / Brand Intelligence</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
              Il cervello operativo Sharkmo: concetti, simboli e frasi trasformabili in contenuti o prodotti.
            </p>
          </div>
          <SharkmoButton onClick={() => openCreate()}><Plus size={16} /> Nuovo concetto</SharkmoButton>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <Filter label="Pilastro" value={pillarFilter} onChange={(value) => setPillarFilter(value as "Tutti" | SharkmoPillar)} options={["Tutti", ...pillars]} />
          <Filter label="Tipo" value={typeFilter} onChange={(value) => setTypeFilter(value as "Tutti" | PhilosophyType)} options={["Tutti", ...philosophyTypes]} />
          <Filter label="Stato" value={statusFilter} onChange={(value) => setStatusFilter(value as "Tutti" | PhilosophyStatus)} options={["Tutti", ...philosophyStatuses]} />
        </div>
      </SharkmoPanel>

      <SharkmoPanel>
        <h2 className="mb-4 text-xl font-semibold text-zinc-50">Pilastri Sharkmo</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(pillarDescriptions).map(([pillar, description]) => (
            <div key={pillar} className="rounded-2xl border border-[#d29f22]/15 bg-white/[0.025] p-4">
              <h3 className="font-semibold text-zinc-50">{pillar}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
              <div className="mt-3">
                <SharkmoButton variant="ghost" onClick={() => openCreate(pillar as SharkmoPillar)}>Crea concetto da questo pilastro</SharkmoButton>
              </div>
            </div>
          ))}
        </div>
      </SharkmoPanel>

      <div className="grid gap-4 xl:grid-cols-2">
        {filteredConcepts.length > 0 ? filteredConcepts.map((concept) => {
          const blocked = isBlocked(concept);
          return (
            <SharkmoPanel key={concept.id} className={selectedEntityId === concept.id || blocked ? "border-[#d29f22]/60" : undefined}>
              <div className="mb-3 flex flex-wrap gap-2">
                <SharkmoBadge>{concept.pillar}</SharkmoBadge>
                <SharkmoBadge tone="dark">{concept.type}</SharkmoBadge>
                <SharkmoBadge tone={concept.status.includes("Trasformato") ? "gold" : "dark"}>{concept.status}</SharkmoBadge>
                {blocked ? <SharkmoBadge tone="red">Bloccato</SharkmoBadge> : null}
              </div>
              <div className="flex items-start gap-3">
                <Brain className="mt-1 shrink-0 text-[#d29f22]" size={20} />
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-zinc-50">{concept.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{concept.sharkmoMeaning || concept.description || "Nessun significato Sharkmo inserito."}</p>
                  {concept.quote ? (
                    <blockquote className="mt-3 border-l-2 border-[#d29f22] pl-3 text-sm italic text-zinc-300">
                      {concept.quote}
                    </blockquote>
                  ) : null}
                  <div className="mt-4 grid gap-2 text-sm text-zinc-400">
                    <p>Contenuto possibile: {concept.possibleContentIdea || "Non definito"}</p>
                    <p>Prodotto possibile: {concept.possibleProductIdea || "Non definito"}</p>
                    {blocked ? <p className="text-rose-100">Fermo da {daysSince(concept.updatedAt)} giorni</p> : null}
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
                    <select
                      value={productLinks[concept.id] ?? concept.transformedIntoProductId ?? ""}
                      onChange={(event) => setProductLinks({ ...productLinks, [concept.id]: event.target.value })}
                      className={sharkmoInputClass}
                    >
                      <option value="">Seleziona prodotto</option>
                      {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                    </select>
                    <SharkmoButton
                      variant="ghost"
                      disabled={!(productLinks[concept.id] ?? concept.transformedIntoProductId)}
                      onClick={() => onLinkToProduct(concept.id, productLinks[concept.id] ?? concept.transformedIntoProductId ?? "")}
                    >
                      Collega a prodotto
                    </SharkmoButton>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <SharkmoButton variant="ghost" onClick={() => openEdit(concept)}>Modifica</SharkmoButton>
                    <SharkmoButton onClick={() => onTransformToIdea(concept.id)}>Trasforma in idea</SharkmoButton>
                    <SharkmoButton onClick={() => onTransformToScript(concept.id)}>Trasforma in script</SharkmoButton>
                    <SharkmoButton variant="ghost" onClick={() => onArchiveConcept(concept.id)}>Archivia</SharkmoButton>
                    <SharkmoButton variant="danger" onClick={() => confirmDelete(concept)}>Elimina</SharkmoButton>
                  </div>
                </div>
              </div>
            </SharkmoPanel>
          );
        }) : (
          <SharkmoPanel>
            <p className="text-sm text-zinc-400">Nessun concetto salvato. Crea il primo concetto.</p>
            <div className="mt-4"><SharkmoButton onClick={() => openCreate()}>Nuovo concetto</SharkmoButton></div>
          </SharkmoPanel>
        )}
      </div>

      {modal ? (
        <ConceptModal
          item={modal.item}
          draft={modal.draft}
          onDraftChange={(draft) => setModal({ ...modal, draft })}
          onClose={() => setModal(null)}
          onSave={saveModal}
        />
      ) : null}
    </div>
  );
}

function ConceptModal({
  item,
  draft,
  onDraftChange,
  onClose,
  onSave,
}: {
  item?: PhilosophyConcept;
  draft: ConceptDraftInput;
  onDraftChange: (draft: ConceptDraftInput) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <SharkmoModal
      eyebrow="Filosofia"
      title={item ? "Modifica concetto" : "Nuovo concetto"}
      onClose={onClose}
      footer={(
        <>
          <SharkmoButton variant="ghost" onClick={onClose}>Chiudi</SharkmoButton>
          <SharkmoButton onClick={onSave} disabled={!draft.title.trim()}>Salva concetto</SharkmoButton>
        </>
      )}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <SharkmoPanel>
          <h3 className="mb-4 text-lg font-semibold text-zinc-50">Identita</h3>
          <div className="grid gap-4">
            <SharkmoField label="Titolo"><input value={draft.title} onChange={(e) => onDraftChange({ ...draft, title: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            <SharkmoField label="Descrizione"><textarea value={draft.description ?? ""} onChange={(e) => onDraftChange({ ...draft, description: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            <div className="grid gap-4 sm:grid-cols-2">
              <SharkmoField label="Tipo">
                <select value={draft.type} onChange={(e) => onDraftChange({ ...draft, type: e.target.value as PhilosophyType })} className={sharkmoInputClass}>
                  {philosophyTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
              </SharkmoField>
              <SharkmoField label="Pilastro">
                <select value={draft.pillar} onChange={(e) => onDraftChange({ ...draft, pillar: e.target.value as SharkmoPillar })} className={sharkmoInputClass}>
                  {pillars.map((pillar) => <option key={pillar}>{pillar}</option>)}
                </select>
              </SharkmoField>
            </div>
            <SharkmoField label="Stato">
              <select value={draft.status} onChange={(e) => onDraftChange({ ...draft, status: e.target.value as PhilosophyStatus })} className={sharkmoInputClass}>
                {philosophyStatuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </SharkmoField>
            <SharkmoField label="Fonte"><input value={draft.source ?? ""} onChange={(e) => onDraftChange({ ...draft, source: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            <SharkmoField label="Quote / frase"><input value={draft.quote ?? ""} onChange={(e) => onDraftChange({ ...draft, quote: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
          </div>
        </SharkmoPanel>

        <SharkmoPanel>
          <h3 className="mb-4 text-lg font-semibold text-zinc-50">Uso operativo</h3>
          <div className="grid gap-4">
            <SharkmoField label="Significato per Sharkmo"><textarea value={draft.sharkmoMeaning ?? ""} onChange={(e) => onDraftChange({ ...draft, sharkmoMeaning: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            <SharkmoField label="Possibile contenuto"><input value={draft.possibleContentIdea ?? ""} onChange={(e) => onDraftChange({ ...draft, possibleContentIdea: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            <SharkmoField label="Possibile prodotto"><input value={draft.possibleProductIdea ?? ""} onChange={(e) => onDraftChange({ ...draft, possibleProductIdea: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            <SharkmoField label="Note"><textarea value={draft.notes ?? ""} onChange={(e) => onDraftChange({ ...draft, notes: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
          </div>
        </SharkmoPanel>
      </div>
    </SharkmoModal>
  );
}

function Filter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <SharkmoField label={label}>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={sharkmoInputClass}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </SharkmoField>
  );
}
