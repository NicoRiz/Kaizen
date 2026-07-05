import { ConceptGrid } from "@/components/concept-grid";
import { PageHeader } from "@/components/page-header";

const cards = [
  {
    title: "Libri",
    description: "Note, passaggi e idee dalle letture in corso o completate.",
  },
  {
    title: "Riflessioni",
    description: "Osservazioni personali e domande che meritano più attenzione.",
  },
  {
    title: "Temi",
    description: "Argomenti ricorrenti che collegano libri, lavoro e vita.",
  },
  {
    title: "Idee ricorrenti",
    description: "Pattern che continuano a emergere e possono diventare principi.",
  },
];

export default function SocratePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        label="Socrate"
        title="Libri e riflessione"
        description="Uno spazio per note di lettura, pensieri personali, temi e idee ricorrenti."
      />
      <ConceptGrid items={cards} />
    </div>
  );
}
