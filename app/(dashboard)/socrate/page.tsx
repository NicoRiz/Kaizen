import { ConceptGrid } from "@/components/concept-grid";
import { PageHeader } from "@/components/page-header";

const cards = [
  {
    title: "Books",
    description: "Notes, passages, and ideas from current and finished reads.",
  },
  {
    title: "Reflections",
    description: "Personal observations and questions that deserve more thought.",
  },
  {
    title: "Themes",
    description: "Recurring topics that connect books, work, and life.",
  },
  {
    title: "Recurring ideas",
    description: "Patterns that keep appearing and may become principles.",
  },
];

export default function SocratePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        label="Socrate"
        title="Books and reflection"
        description="A place for reading notes, personal thinking, themes, and recurring ideas."
      />
      <ConceptGrid items={cards} />
    </div>
  );
}
