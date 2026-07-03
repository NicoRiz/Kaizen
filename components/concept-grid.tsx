type ConceptGridProps = {
  items: Array<{
    title: string;
    description: string;
  }>;
};

export function ConceptGrid({ items }: ConceptGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <article
          key={item.title}
          className="min-h-44 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-soft"
        >
          <div className="mb-5 h-1.5 w-12 rounded-full bg-moss-400" />
          <h2 className="text-lg font-semibold text-zinc-50">{item.title}</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">{item.description}</p>
        </article>
      ))}
    </div>
  );
}
