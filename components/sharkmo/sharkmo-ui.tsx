import { clsx } from "clsx";
import { X } from "lucide-react";

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
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-45",
        variant === "primary" && "bg-[#d29f22] text-[#19121b] hover:bg-[#f0c75e]",
        variant === "ghost" && "border border-white/10 text-zinc-100 hover:bg-white/5",
        variant === "danger" && "border border-rose-300/20 text-rose-200 hover:bg-rose-400/10",
      )}
    >
      {children}
    </button>
  );
}

export function SharkmoModal({
  title,
  eyebrow,
  children,
  footer,
  onClose,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-md">
      <div className="flex min-h-dvh items-end justify-center p-4 sm:items-center">
        <section className="max-h-[92dvh] w-full overflow-hidden rounded-3xl border border-[#d29f22]/25 bg-[#19121b] shadow-soft sm:max-w-5xl">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
            <div>
              {eyebrow ? <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#d29f22]">{eyebrow}</p> : null}
              <h2 className="mt-2 text-xl font-semibold text-zinc-50">{title}</h2>
            </div>
            <button onClick={onClose} className="flex size-10 items-center justify-center rounded-full border border-white/10 text-zinc-300 hover:bg-white/5" aria-label="Chiudi modal">
              <X size={18} />
            </button>
          </div>
          <div className="max-h-[calc(92dvh-9rem)] overflow-y-auto p-5">{children}</div>
          {footer ? <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 p-5">{footer}</div> : null}
        </section>
      </div>
    </div>
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
