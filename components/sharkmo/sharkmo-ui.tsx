import { clsx } from "clsx";

export function SharkmoPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx("rounded-3xl border border-[#d29f22]/15 bg-[#19121b]/88 p-5 shadow-soft", className)}>
      {children}
    </section>
  );
}

export function SharkmoBadge({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "red" | "dark" }) {
  return (
    <span
      className={clsx(
        "rounded-full px-3 py-1 text-xs font-semibold",
        tone === "gold" && "bg-[#d29f22]/15 text-[#f3c85a]",
        tone === "red" && "bg-[#5d0018]/60 text-rose-100",
        tone === "dark" && "bg-white/[0.06] text-zinc-300",
      )}
    >
      {children}
    </span>
  );
}

export function SharkmoButton({
  children,
  onClick,
  variant = "primary",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        "rounded-full px-4 py-2 text-sm font-semibold transition",
        variant === "primary" && "bg-[#d29f22] text-[#19121b] hover:bg-[#f0c75e]",
        variant === "ghost" && "border border-white/10 text-zinc-100 hover:bg-white/5",
        variant === "danger" && "border border-rose-300/20 text-rose-200 hover:bg-rose-400/10",
      )}
    >
      {children}
    </button>
  );
}

export function SharkmoField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

export const sharkmoInputClass = "w-full rounded-2xl border border-white/10 bg-[#252628] px-4 py-3 text-sm text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-[#d29f22]/60";
