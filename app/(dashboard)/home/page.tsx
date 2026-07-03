import { CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { TaskCard } from "@/components/task-card";

const tasks = [
  {
    title: "Review today's priorities",
    description: "Choose the three actions that make the day feel complete.",
    priority: "High",
  },
  {
    title: "Capture one useful idea",
    description: "Save a hook, note, book thought, or learning resource.",
    priority: "Medium",
  },
  {
    title: "Skill practice block",
    description: "Spend focused time on the next repeatable learning step.",
    priority: "Low",
  },
] as const;

export default function HomePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        label="Home"
        title="Daily overview"
        description="A simple place to see today's tasks, priorities, and future calendar signals."
      />

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <SectionCard title="Tasks" description="Keep the day clear and actionable.">
          <div className="grid gap-3">
            {tasks.map((task) => (
              <TaskCard key={task.title} {...task} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Calendar" description="Future events will appear here.">
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-center">
            <CalendarDays className="mb-4 text-moss-300" size={30} />
            <p className="text-sm font-medium text-zinc-100">Calendar placeholder</p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-400">
              Connect calendar events later to shape the daily planning view.
            </p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
