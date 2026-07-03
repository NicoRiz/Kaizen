type PageHeaderProps = {
  label: string;
  title: string;
  description: string;
};

export function PageHeader({ label, title, description }: PageHeaderProps) {
  return (
    <header className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-soft sm:p-7">
      <p className="text-sm font-medium uppercase tracking-[0.28em] text-moss-300">{label}</p>
      <h1 className="mt-3 text-3xl font-semibold text-zinc-50 sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">{description}</p>
    </header>
  );
}
