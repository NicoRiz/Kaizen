import { ConceptGrid } from "@/components/concept-grid";
import { PageHeader } from "@/components/page-header";

const cards = [
  {
    title: "Videos",
    description: "Long-form lessons and useful walkthroughs to revisit.",
  },
  {
    title: "Reels",
    description: "Short clips with practical examples, drills, or prompts.",
  },
  {
    title: "Tutorials",
    description: "Step-by-step resources for building repeatable skills.",
  },
  {
    title: "Tips",
    description: "Small tactics, reminders, and refinements worth keeping close.",
  },
];

export default function SkillsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        label="Skills"
        title="Learning resources"
        description="A quiet library for videos, reels, tutorials, and practical tips."
      />
      <ConceptGrid items={cards} />
    </div>
  );
}
