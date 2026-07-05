import { ConceptGrid } from "@/components/concept-grid";
import { PageHeader } from "@/components/page-header";

const cards = [
  {
    title: "Videos",
    description: "Lezioni lunghe e walkthrough utili da rivedere.",
  },
  {
    title: "Reels",
    description: "Clip brevi con esempi pratici, esercizi o prompt.",
  },
  {
    title: "Tutorial",
    description: "Risorse passo passo per costruire skill ripetibili.",
  },
  {
    title: "Consigli",
    description: "Piccole tattiche, promemoria e rifiniture da tenere a portata.",
  },
];

export default function SkillsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        label="Skills"
        title="Risorse di apprendimento"
        description="Una libreria ordinata per video, reel, tutorial e consigli pratici."
      />
      <ConceptGrid items={cards} />
    </div>
  );
}
