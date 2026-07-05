import { ConceptGrid } from "@/components/concept-grid";
import { PageHeader } from "@/components/page-header";

const cards = [
  {
    title: "Concetti",
    description: "Idee di brand, angoli e temi ancora da modellare.",
  },
  {
    title: "Hooks",
    description: "Aperture, pattern di attenzione e strutture contenuto riutilizzabili.",
  },
  {
    title: "Idee post",
    description: "Spunti per post, script, caroselli e contenuti più lunghi.",
  },
  {
    title: "Riferimenti filosofici",
    description: "Principi, citazioni e riferimenti che possono guidare la voce.",
  },
];

export default function SharkmoPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        label="Sharkmo"
        title="Idee brand e contenuto"
        description="Uno spazio preparato per concetti, hook, idee post e riferimenti filosofici."
      />
      <ConceptGrid items={cards} />
    </div>
  );
}
