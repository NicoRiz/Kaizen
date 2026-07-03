import { clsx } from "clsx";

const priorityStyles: Record<string, string> = {
  High: "bg-rose-400/15 text-rose-200 ring-rose-300/20",
  Medium: "bg-amber-300/15 text-amber-100 ring-amber-200/20",
  Low: "bg-moss-400/15 text-moss-300 ring-moss-300/20",
};

type TaskCardProps = {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
};

export function TaskCard({ title, description, priority }: TaskCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-medium text-zinc-50">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
        </div>
        <span
          className={clsx(
            "shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1",
            priorityStyles[priority],
          )}
        >
          {priority}
        </span>
      </div>
    </article>
  );
}
