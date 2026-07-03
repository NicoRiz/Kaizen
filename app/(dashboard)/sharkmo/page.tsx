import { ConceptGrid } from "@/components/concept-grid";
import { PageHeader } from "@/components/page-header";

const cards = [
  {
    title: "Concepts",
    description: "Raw brand ideas, angles, and themes waiting to be shaped.",
  },
  {
    title: "Hooks",
    description: "Opening lines, attention patterns, and repeatable content frames.",
  },
  {
    title: "Post ideas",
    description: "Draft seeds for posts, scripts, carousels, and long-form pieces.",
  },
  {
    title: "Philosophy references",
    description: "Principles, quotes, and references that can inform the voice.",
  },
];

export default function SharkmoPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        label="Sharkmo"
        title="Brand and content ideas"
        description="A prepared workspace for concepts, hooks, post ideas, and philosophy references."
      />
      <ConceptGrid items={cards} />
    </div>
  );
}
