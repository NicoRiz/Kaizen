"use client";

import { CalendarDays, KanbanSquare, PenLine } from "lucide-react";
import { SharkmoBadge, SharkmoButton, SharkmoField, SharkmoPanel, sharkmoInputClass } from "@/components/sharkmo/sharkmo-ui";
import type { ContentItem, ContentStatus } from "@/lib/sharkmo/types";

type SharkmoContentStudioProps = {
  contents: ContentItem[];
  onAdvanceContent: (contentId: string) => void;
  onUpdateStatus: (contentId: string, status: ContentStatus) => void;
  onSchedule: (contentId: string, publishDate: string, platform: string) => void;
};

const pipelineStatuses: ContentStatus[] = ["Da registrare", "Registrato", "Da editare", "Editato", "Programmato", "Pubblicato"];

export function SharkmoContentStudio({
  contents,
  onAdvanceContent,
  onUpdateStatus,
  onSchedule,
}: SharkmoContentStudioProps) {
  const ideas = contents.filter((item) => item.status === "Idea");
  const scripts = contents.filter((item) => item.status === "Script");
  const scheduled = contents.filter((item) => item.publishDate || item.status === "Editato" || item.status === "Programmato");

  return (
    <div className="space-y-5">
      <SharkmoPanel>
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#d29f22]">Content Studio</p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-50">Social, script e calendario</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
          Ogni cambio stato aggiorna il tracking: registrato, editato, pubblicato, performance.
        </p>
      </SharkmoPanel>

      <div className="grid gap-5 xl:grid-cols-2">
        <SharkmoPanel>
          <div className="mb-4 flex items-center gap-3">
            <PenLine className="text-[#d29f22]" size={20} />
            <h2 className="text-xl font-semibold text-zinc-50">Idee</h2>
          </div>
          <div className="grid gap-3">
            {ideas.length > 0 ? ideas.map((item) => (
              <ContentCard key={item.id} item={item} onAdvanceContent={onAdvanceContent} onUpdateStatus={onUpdateStatus} />
            )) : <Empty text="Nessuna idea pura: lavora sugli script e sulla pipeline." />}
          </div>
        </SharkmoPanel>

        <SharkmoPanel>
          <div className="mb-4 flex items-center gap-3">
            <PenLine className="text-[#d29f22]" size={20} />
            <h2 className="text-xl font-semibold text-zinc-50">Script</h2>
          </div>
          <div className="grid gap-3">
            {scripts.length > 0 ? scripts.map((item) => (
              <ContentCard key={item.id} item={item} onAdvanceContent={onAdvanceContent} onUpdateStatus={onUpdateStatus} />
            )) : <Empty text="Nessuno script aperto." />}
          </div>
        </SharkmoPanel>
      </div>

      <SharkmoPanel>
        <div className="mb-4 flex items-center gap-3">
          <KanbanSquare className="text-[#d29f22]" size={20} />
          <h2 className="text-xl font-semibold text-zinc-50">Pipeline produzione</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-3 2xl:grid-cols-6">
          {pipelineStatuses.map((status) => (
            <div key={status} className="rounded-2xl border border-white/10 bg-white/[0.025] p-3">
              <h3 className="mb-3 text-sm font-semibold text-zinc-200">{status}</h3>
              <div className="grid gap-3">
                {contents.filter((item) => item.status === status).map((item) => (
                  <article key={item.id} className="rounded-xl border border-white/10 bg-[#252628] p-3">
                    <p className="text-sm font-medium text-zinc-50">{item.title}</p>
                    <p className="mt-1 text-xs text-zinc-500">{item.pillar}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <SharkmoButton variant="ghost" onClick={() => onAdvanceContent(item.id)}>Avanza</SharkmoButton>
                      {item.status === "Pubblicato" ? (
                        <SharkmoButton onClick={() => onUpdateStatus(item.id, "Performance")}>Performance</SharkmoButton>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SharkmoPanel>

      <SharkmoPanel>
        <div className="mb-4 flex items-center gap-3">
          <CalendarDays className="text-[#d29f22]" size={20} />
          <h2 className="text-xl font-semibold text-zinc-50">Calendario pubblicazioni</h2>
        </div>
        <div className="grid gap-3 xl:grid-cols-2">
          {scheduled.map((item) => (
            <ScheduleCard key={item.id} item={item} onSchedule={onSchedule} onUpdateStatus={onUpdateStatus} />
          ))}
        </div>
      </SharkmoPanel>
    </div>
  );
}

function ContentCard({
  item,
  onAdvanceContent,
  onUpdateStatus,
}: {
  item: ContentItem;
  onAdvanceContent: (contentId: string) => void;
  onUpdateStatus: (contentId: string, status: ContentStatus) => void;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-wrap gap-2">
        <SharkmoBadge>{item.category}</SharkmoBadge>
        <SharkmoBadge tone="dark">{item.status}</SharkmoBadge>
      </div>
      <h3 className="mt-3 font-semibold text-zinc-50">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{item.hook || item.description}</p>
      <p className="mt-2 text-xs text-zinc-500">Pilastro: {item.pillar}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <SharkmoButton onClick={() => onAdvanceContent(item.id)}>
          {item.status === "Idea" ? "Trasforma in script" : "Avanza stato"}
        </SharkmoButton>
        <SharkmoButton variant="ghost" onClick={() => onUpdateStatus(item.id, "Archiviato")}>Archivia</SharkmoButton>
      </div>
    </article>
  );
}

function ScheduleCard({
  item,
  onSchedule,
  onUpdateStatus,
}: {
  item: ContentItem;
  onSchedule: (contentId: string, publishDate: string, platform: string) => void;
  onUpdateStatus: (contentId: string, status: ContentStatus) => void;
}) {
  const defaultDate = item.publishDate ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <SharkmoBadge tone={item.status === "Programmato" ? "gold" : "dark"}>{item.status}</SharkmoBadge>
        <span className="text-xs text-zinc-500">{item.platform}</span>
      </div>
      <h3 className="mt-3 font-semibold text-zinc-50">{item.title}</h3>
      <p className="mt-2 text-sm text-zinc-400">
        {item.publishDate ? new Date(item.publishDate).toLocaleString("it-IT") : "Pronto ma non programmato"}
      </p>
      <form
        className="mt-4 grid gap-3 sm:grid-cols-[1fr_0.8fr_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          onSchedule(item.id, new Date(String(form.get("publishDate"))).toISOString(), String(form.get("platform")));
        }}
      >
        <input name="publishDate" type="datetime-local" defaultValue={defaultDate.slice(0, 16)} className={sharkmoInputClass} />
        <input name="platform" defaultValue={item.platform} className={sharkmoInputClass} />
        <SharkmoButton type="submit">Programma</SharkmoButton>
      </form>
      {item.status === "Programmato" ? (
        <div className="mt-3">
          <SharkmoButton onClick={() => onUpdateStatus(item.id, "Pubblicato")}>Segna pubblicato</SharkmoButton>
        </div>
      ) : null}
    </article>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-5 text-sm text-zinc-400">{text}</p>;
}
