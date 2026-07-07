"use client";

import { Brain } from "lucide-react";
import { SharkmoBadge, SharkmoButton, SharkmoPanel } from "@/components/sharkmo/sharkmo-ui";
import type { PhilosophyConcept } from "@/lib/sharkmo/types";

type SharkmoPhilosophyProps = {
  concepts: PhilosophyConcept[];
  selectedEntityId?: string | null;
  onTransformToScript: (conceptId: string) => void;
};

const pillarDescriptions = {
  Movimento: "KeepMoving, direzione, azione, disciplina, evoluzione.",
  "Istinto controllato": "Forza piu controllo, fame, lucidita, autocontrollo.",
  "Evoluzione personale": "Crescita, cambiamento, identita, abitudini.",
  "Estetica Sharkmo": "Nero, oro, bordeaux, silhouette, lusso trap elegante.",
  "Anti-burattino": "Consapevolezza, indipendenza mentale, scelta.",
  "Costruzione del brand": "Processo, prototipi, tech pack, nascita del brand.",
};

export function SharkmoPhilosophy({ concepts, selectedEntityId, onTransformToScript }: SharkmoPhilosophyProps) {
  return (
    <div className="space-y-5">
      <SharkmoPanel>
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#d29f22]">Filosofia</p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-50">Brand Intelligence</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
          Il cervello Sharkmo: concetti, simboli, frasi e significati trasformabili in contenuti o prodotti.
        </p>
      </SharkmoPanel>

      <div className="grid gap-4 lg:grid-cols-3">
        {Object.entries(pillarDescriptions).map(([pillar, description]) => (
          <div key={pillar} className="rounded-2xl border border-[#d29f22]/15 bg-[#19121b]/80 p-4">
            <h3 className="font-semibold text-zinc-50">{pillar}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {concepts.map((concept) => (
          <SharkmoPanel key={concept.id} className={selectedEntityId === concept.id ? "border-[#d29f22]/60" : undefined}>
            <div className="mb-3 flex flex-wrap gap-2">
              <SharkmoBadge>{concept.pillar}</SharkmoBadge>
              <SharkmoBadge tone="dark">{concept.status}</SharkmoBadge>
            </div>
            <div className="flex items-start gap-3">
              <Brain className="mt-1 shrink-0 text-[#d29f22]" size={20} />
              <div>
                <h2 className="text-lg font-semibold text-zinc-50">{concept.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{concept.sharkmoMeaning}</p>
                <blockquote className="mt-3 border-l-2 border-[#d29f22] pl-3 text-sm italic text-zinc-300">
                  {concept.quote}
                </blockquote>
                <div className="mt-4 grid gap-2 text-sm text-zinc-400">
                  <p>Contenuto possibile: {concept.possibleContentIdea}</p>
                  <p>Prodotto possibile: {concept.possibleProductIdea}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <SharkmoButton onClick={() => onTransformToScript(concept.id)}>Trasforma in script</SharkmoButton>
                  <SharkmoButton variant="ghost">Collega a prodotto</SharkmoButton>
                </div>
              </div>
            </div>
          </SharkmoPanel>
        ))}
      </div>
    </div>
  );
}
