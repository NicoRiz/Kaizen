import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";

const filters = ["Links", "Videos", "Notes", "Ideas", "Books"];

export default function ArchivePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        label="Archive"
        title="Saved content"
        description="A general archive for the content, notes, and ideas that should stay searchable."
      />

      <SectionCard title="Filters" description="Prepared categories for future saved content.">
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-moss-400/50 hover:bg-moss-400/10 hover:text-moss-300"
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-sm leading-6 text-zinc-400">
          Archived links, videos, notes, ideas, and books will appear here once the data model is connected.
        </div>
      </SectionCard>
    </div>
  );
}
