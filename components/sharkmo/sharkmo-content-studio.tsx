"use client";

import { useState } from "react";
import { CalendarDays, KanbanSquare, PenLine, Plus } from "lucide-react";
import { SharkmoBadge, SharkmoButton, SharkmoField, SharkmoModal, SharkmoPanel, sharkmoInputClass } from "@/components/sharkmo/sharkmo-ui";
import type { ContentCategory, ContentItem, ContentStatus, SharkmoPillar } from "@/lib/sharkmo/types";
import type { ContentDraftInput } from "@/lib/sharkmo/use-sharkmo-store";

type SharkmoContentStudioProps = {
  contents: ContentItem[];
  selectedEntityId?: string | null;
  onCreateContent: (input: ContentDraftInput) => string;
  onUpdateContent: (content: ContentItem) => void;
  onDeleteContent: (contentId: string) => void;
  onArchiveContent: (contentId: string) => void;
  onAdvanceContent: (contentId: string) => void;
  onUpdateStatus: (contentId: string, status: ContentStatus) => void;
  onSchedule: (contentId: string, publishDate: string, platform: string) => void;
  onUnschedule: (contentId: string) => void;
};

const contentStatuses: ContentStatus[] = ["Idea", "Script", "Da registrare", "Registrato", "Da editare", "Editato", "Programmato", "Pubblicato", "Performance", "Archiviato"];
const pipelineStatuses: ContentStatus[] = ["Idea", "Script", "Da registrare", "Registrato", "Da editare", "Editato", "Programmato", "Pubblicato", "Performance"];
const contentCategories: ContentCategory[] = ["Dietro le quinte", "Filosofia / Messaggi", "Community / Interazione", "Lancio / Vendita", "Prodotto / Outfit", "Trend adattato a Sharkmo"];
const sharkmoPillars: SharkmoPillar[] = ["Movimento", "Istinto controllato", "Evoluzione personale", "Estetica Sharkmo", "Anti-burattino", "Costruzione del brand"];

type ModalMode = "idea" | "script" | "scheduled" | "edit";

const emptyDraft: ContentDraftInput = {
  title: "",
  description: "",
  category: "Filosofia / Messaggi",
  pillar: "Movimento",
  platform: "Instagram / TikTok",
  format: "Reel",
  status: "Idea",
  hook: "",
  scriptText: "",
  visualNotes: "",
  cta: "",
  source: "",
  publishDate: null,
  notes: "",
};

function daysSince(value: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / (24 * 60 * 60 * 1000)));
}

function isBlocked(item: ContentItem) {
  return item.status !== "Archiviato" && daysSince(item.lastStatusChangeAt) >= 5;
}

function toDatetimeLocal(value?: string | null) {
  if (!value) return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
  return new Date(value).toISOString().slice(0, 16);
}

export function SharkmoContentStudio({
  contents,
  selectedEntityId,
  onCreateContent,
  onUpdateContent,
  onDeleteContent,
  onArchiveContent,
  onAdvanceContent,
  onUpdateStatus,
  onSchedule,
  onUnschedule,
}: SharkmoContentStudioProps) {
  const [modal, setModal] = useState<{ mode: ModalMode; item?: ContentItem; draft: ContentDraftInput } | null>(null);
  const ideas = contents.filter((item) => item.status === "Idea");
  const scripts = contents.filter((item) => item.status === "Script");
  const scheduled = contents.filter((item) => item.status === "Editato" || item.status === "Programmato" || Boolean(item.publishDate));

  function openCreate(mode: ModalMode) {
    const status: ContentStatus = mode === "script" ? "Script" : mode === "scheduled" ? "Programmato" : "Idea";
    setModal({
      mode,
      draft: {
        ...emptyDraft,
        status,
        publishDate: mode === "scheduled" ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null,
      },
    });
  }

  function openEdit(item: ContentItem, mode: ModalMode = "edit") {
    setModal({
      mode,
      item,
      draft: {
        title: item.title,
        description: item.description,
        category: item.category,
        pillar: item.pillar,
        platform: item.platform,
        format: item.format,
        status: mode === "script" ? "Script" : item.status,
        hook: item.hook,
        scriptText: item.scriptText,
        visualNotes: item.visualNotes,
        cta: item.cta,
        source: item.source,
        publishDate: item.publishDate,
        linkedPhilosophyConceptId: item.linkedPhilosophyConceptId,
        linkedProductId: item.linkedProductId,
        notes: item.notes,
      },
    });
  }

  function saveModal() {
    if (!modal || !modal.draft.title.trim()) return;
    const publishDate = modal.draft.publishDate ? new Date(modal.draft.publishDate).toISOString() : null;
    const draft = {
      ...modal.draft,
      title: modal.draft.title.trim(),
      publishDate,
      status: modal.mode === "scheduled" ? "Programmato" as const : modal.draft.status,
    };

    if (modal.item) {
      onUpdateContent({ ...modal.item, ...draft, status: draft.status ?? modal.item.status });
    } else {
      onCreateContent(draft);
    }
    setModal(null);
  }

  function handleTransformIdea(item: ContentItem) {
    if (!item.hook || !item.scriptText) {
      openEdit(item, "script");
      return;
    }
    onUpdateStatus(item.id, "Script");
  }

  function confirmDelete(item: ContentItem) {
    if (window.confirm("Sei sicuro di voler eliminare questo contenuto?")) {
      onDeleteContent(item.id);
    }
  }

  return (
    <div className="space-y-5">
      <SharkmoPanel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#d29f22]">Content Studio</p>
            <h1 className="mt-3 text-3xl font-semibold text-zinc-50">Social, script e calendario</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
              Crea idee, completa script, programma pubblicazioni e porta ogni contenuto nella pipeline.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SharkmoButton onClick={() => openCreate("idea")}><Plus size={16} /> Nuova idea</SharkmoButton>
            <SharkmoButton onClick={() => openCreate("script")}><Plus size={16} /> Nuovo script</SharkmoButton>
            <SharkmoButton onClick={() => openCreate("scheduled")}><Plus size={16} /> Nuova pubblicazione programmata</SharkmoButton>
          </div>
        </div>
      </SharkmoPanel>

      <div className="grid gap-5 xl:grid-cols-2">
        <SharkmoPanel>
          <SectionTitle icon={<PenLine className="text-[#d29f22]" size={20} />} title="Idee" />
          <div className="grid gap-3">
            {ideas.length > 0 ? ideas.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                selected={selectedEntityId === item.id}
                onEdit={() => openEdit(item)}
                onAdvance={() => handleTransformIdea(item)}
                onArchive={() => onArchiveContent(item.id)}
                onDelete={() => confirmDelete(item)}
              />
            )) : <Empty text="Non hai ancora idee. Crea la prima idea." actionLabel="Nuova idea" onAction={() => openCreate("idea")} />}
          </div>
        </SharkmoPanel>

        <SharkmoPanel>
          <SectionTitle icon={<PenLine className="text-[#d29f22]" size={20} />} title="Script" />
          <div className="grid gap-3">
            {scripts.length > 0 ? scripts.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                selected={selectedEntityId === item.id}
                onEdit={() => openEdit(item)}
                onAdvance={() => onAdvanceContent(item.id)}
                onArchive={() => onArchiveContent(item.id)}
                onDelete={() => confirmDelete(item)}
              />
            )) : <Empty text="Non hai script aperti." actionLabel="Nuovo script" onAction={() => openCreate("script")} />}
          </div>
        </SharkmoPanel>
      </div>

      <SharkmoPanel>
        <SectionTitle icon={<KanbanSquare className="text-[#d29f22]" size={20} />} title="Pipeline produzione" />
        <div className="grid gap-3 lg:grid-cols-3 2xl:grid-cols-5">
          {pipelineStatuses.map((status) => {
            const items = contents.filter((item) => item.status === status);
            return (
              <div key={status} className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
                <h3 className="mb-3 text-sm font-semibold text-zinc-200">{status}</h3>
                <div className="grid gap-3">
                  {items.length > 0 ? items.map((item) => (
                    <article key={item.id} className={`rounded-xl border bg-[#252628] p-3 ${selectedEntityId === item.id || isBlocked(item) ? "border-[#d29f22]/70" : "border-white/10"}`}>
                      <div className="flex flex-wrap gap-2">
                        {isBlocked(item) ? <SharkmoBadge tone="red">Bloccato</SharkmoBadge> : null}
                        <SharkmoBadge tone="dark">{item.pillar}</SharkmoBadge>
                      </div>
                      <p className="mt-3 text-sm font-medium text-zinc-50">{item.title}</p>
                      {isBlocked(item) ? <p className="mt-1 text-xs text-rose-100">Fermo da {daysSince(item.lastStatusChangeAt)} giorni</p> : null}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <SharkmoButton variant="ghost" onClick={() => openEdit(item)}>Modifica</SharkmoButton>
                        <SharkmoButton variant="ghost" onClick={() => onAdvanceContent(item.id)}>Avanza</SharkmoButton>
                        {item.status === "Pubblicato" ? <SharkmoButton onClick={() => onUpdateStatus(item.id, "Performance")}>Performance</SharkmoButton> : null}
                      </div>
                    </article>
                  )) : <p className="text-xs text-zinc-600">Vuoto</p>}
                </div>
              </div>
            );
          })}
        </div>
      </SharkmoPanel>

      <SharkmoPanel>
        <SectionTitle icon={<CalendarDays className="text-[#d29f22]" size={20} />} title="Calendario pubblicazioni" />
        <div className="grid gap-3 xl:grid-cols-2">
          {scheduled.length > 0 ? scheduled.map((item) => (
            <ScheduleCard
              key={item.id}
              item={item}
              selected={selectedEntityId === item.id}
              onEdit={() => openEdit(item, "scheduled")}
              onSchedule={onSchedule}
              onUnschedule={() => onUnschedule(item.id)}
              onPublished={() => onUpdateStatus(item.id, "Pubblicato")}
              onDelete={() => confirmDelete(item)}
            />
          )) : <Empty text="Nessuna pubblicazione programmata." actionLabel="Nuova pubblicazione programmata" onAction={() => openCreate("scheduled")} />}
        </div>
      </SharkmoPanel>

      {modal ? (
        <ContentModal
          mode={modal.mode}
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

function ContentModal({
  mode,
  item,
  draft,
  onDraftChange,
  onClose,
  onSave,
}: {
  mode: ModalMode;
  item?: ContentItem;
  draft: ContentDraftInput;
  onDraftChange: (draft: ContentDraftInput) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const title = item ? "Modifica contenuto" : mode === "script" ? "Nuovo script" : mode === "scheduled" ? "Nuova pubblicazione programmata" : "Nuova idea";
  const isScriptLike = mode === "script" || draft.status === "Script" || draft.status === "Da registrare";
  const isScheduled = mode === "scheduled" || draft.status === "Programmato";

  return (
    <SharkmoModal
      eyebrow="Content Studio"
      title={title}
      onClose={onClose}
      footer={(
        <>
          <SharkmoButton variant="ghost" onClick={onClose}>Chiudi</SharkmoButton>
          <SharkmoButton onClick={onSave} disabled={!draft.title.trim()}>Salva</SharkmoButton>
        </>
      )}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <SharkmoPanel>
          <h3 className="mb-4 text-lg font-semibold text-zinc-50">Base</h3>
          <div className="grid gap-4">
            <SharkmoField label="Titolo"><input value={draft.title} onChange={(e) => onDraftChange({ ...draft, title: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            <SharkmoField label="Descrizione"><textarea value={draft.description ?? ""} onChange={(e) => onDraftChange({ ...draft, description: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            <div className="grid gap-4 sm:grid-cols-2">
              <SharkmoField label="Categoria">
                <select value={draft.category} onChange={(e) => onDraftChange({ ...draft, category: e.target.value as ContentCategory })} className={sharkmoInputClass}>
                  {contentCategories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </SharkmoField>
              <SharkmoField label="Pilastro">
                <select value={draft.pillar} onChange={(e) => onDraftChange({ ...draft, pillar: e.target.value as SharkmoPillar })} className={sharkmoInputClass}>
                  {sharkmoPillars.map((pillar) => <option key={pillar}>{pillar}</option>)}
                </select>
              </SharkmoField>
            </div>
            <SharkmoField label="Stato">
              <select value={draft.status} onChange={(e) => onDraftChange({ ...draft, status: e.target.value as ContentStatus })} className={sharkmoInputClass}>
                {contentStatuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </SharkmoField>
          </div>
        </SharkmoPanel>

        <SharkmoPanel>
          <h3 className="mb-4 text-lg font-semibold text-zinc-50">Produzione</h3>
          <div className="grid gap-4">
            <SharkmoField label="Fonte / ispirazione"><input value={draft.source ?? ""} onChange={(e) => onDraftChange({ ...draft, source: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            <SharkmoField label="Hook opzionale"><input value={draft.hook ?? ""} onChange={(e) => onDraftChange({ ...draft, hook: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            {isScriptLike ? (
              <>
                <SharkmoField label="Script / voiceover"><textarea value={draft.scriptText ?? ""} onChange={(e) => onDraftChange({ ...draft, scriptText: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
                <SharkmoField label="Visual notes"><textarea value={draft.visualNotes ?? ""} onChange={(e) => onDraftChange({ ...draft, visualNotes: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
                <SharkmoField label="CTA"><input value={draft.cta ?? ""} onChange={(e) => onDraftChange({ ...draft, cta: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
              </>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <SharkmoField label="Piattaforma"><input value={draft.platform ?? ""} onChange={(e) => onDraftChange({ ...draft, platform: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
              <SharkmoField label="Formato"><input value={draft.format ?? ""} onChange={(e) => onDraftChange({ ...draft, format: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            </div>
            {isScheduled ? (
              <SharkmoField label="Data / orario pubblicazione">
                <input type="datetime-local" value={toDatetimeLocal(draft.publishDate)} onChange={(e) => onDraftChange({ ...draft, publishDate: e.target.value })} className={sharkmoInputClass} />
              </SharkmoField>
            ) : null}
            <SharkmoField label="Note"><textarea value={draft.notes ?? ""} onChange={(e) => onDraftChange({ ...draft, notes: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
          </div>
        </SharkmoPanel>
      </div>
    </SharkmoModal>
  );
}

function ContentCard({
  item,
  selected,
  onEdit,
  onAdvance,
  onArchive,
  onDelete,
}: {
  item: ContentItem;
  selected?: boolean;
  onEdit: () => void;
  onAdvance: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const blocked = isBlocked(item);

  return (
    <article className={`rounded-2xl border bg-white/[0.03] p-4 ${selected || blocked ? "border-[#d29f22]/70" : "border-white/10"}`}>
      <div className="flex flex-wrap gap-2">
        <SharkmoBadge>{item.category}</SharkmoBadge>
        <SharkmoBadge tone="dark">{item.status}</SharkmoBadge>
        {blocked ? <SharkmoBadge tone="red">Bloccato</SharkmoBadge> : null}
      </div>
      <h3 className="mt-3 font-semibold text-zinc-50">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{item.hook || item.description || "Nessuna descrizione inserita."}</p>
      <p className="mt-2 text-xs text-zinc-500">Pilastro: {item.pillar}</p>
      {blocked ? <p className="mt-2 text-xs text-rose-100">Fermo da {daysSince(item.lastStatusChangeAt)} giorni</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <SharkmoButton onClick={onAdvance}>{item.status === "Idea" ? "Trasforma in script" : "Avanza stato"}</SharkmoButton>
        <SharkmoButton variant="ghost" onClick={onEdit}>Modifica</SharkmoButton>
        <SharkmoButton variant="ghost" onClick={onArchive}>Archivia</SharkmoButton>
        <SharkmoButton variant="danger" onClick={onDelete}>Elimina</SharkmoButton>
      </div>
    </article>
  );
}

function ScheduleCard({
  item,
  selected,
  onEdit,
  onSchedule,
  onUnschedule,
  onPublished,
  onDelete,
}: {
  item: ContentItem;
  selected?: boolean;
  onEdit: () => void;
  onSchedule: (contentId: string, publishDate: string, platform: string) => void;
  onUnschedule: () => void;
  onPublished: () => void;
  onDelete: () => void;
}) {
  const blocked = isBlocked(item);

  return (
    <article className={`rounded-2xl border bg-white/[0.03] p-4 ${selected || blocked ? "border-[#d29f22]/70" : "border-white/10"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <SharkmoBadge tone={item.status === "Programmato" ? "gold" : "dark"}>{item.status}</SharkmoBadge>
        {blocked ? <SharkmoBadge tone="red">Bloccato</SharkmoBadge> : null}
        <span className="text-xs text-zinc-500">{item.platform}</span>
      </div>
      <h3 className="mt-3 font-semibold text-zinc-50">{item.title}</h3>
      <p className="mt-2 text-sm text-zinc-400">
        {item.publishDate ? new Date(item.publishDate).toLocaleString("it-IT") : "Pronto ma non programmato"}
      </p>
      {blocked ? <p className="mt-1 text-xs text-rose-100">Fermo da {daysSince(item.lastStatusChangeAt)} giorni</p> : null}
      <form
        className="mt-4 grid gap-3 sm:grid-cols-[1fr_0.8fr_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          onSchedule(item.id, new Date(String(form.get("publishDate"))).toISOString(), String(form.get("platform")));
        }}
      >
        <input name="publishDate" type="datetime-local" defaultValue={toDatetimeLocal(item.publishDate)} className={sharkmoInputClass} />
        <input name="platform" defaultValue={item.platform} className={sharkmoInputClass} />
        <SharkmoButton type="submit">Programma</SharkmoButton>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        <SharkmoButton variant="ghost" onClick={onEdit}>Modifica</SharkmoButton>
        {item.status === "Programmato" ? <SharkmoButton onClick={onPublished}>Segna pubblicato</SharkmoButton> : null}
        {item.status === "Programmato" ? <SharkmoButton variant="ghost" onClick={onUnschedule}>Annulla programmazione</SharkmoButton> : null}
        <SharkmoButton variant="danger" onClick={onDelete}>Elimina</SharkmoButton>
      </div>
    </article>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      {icon}
      <h2 className="text-xl font-semibold text-zinc-50">{title}</h2>
    </div>
  );
}

function Empty({ text, actionLabel, onAction }: { text: string; actionLabel: string; onAction: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-5">
      <p className="text-sm text-zinc-400">{text}</p>
      <div className="mt-4">
        <SharkmoButton onClick={onAction}>{actionLabel}</SharkmoButton>
      </div>
    </div>
  );
}
