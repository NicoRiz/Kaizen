"use client";

import { useState } from "react";
import { BarChart3, Brain, Home, Package, PenLine } from "lucide-react";
import { SharkmoContentStudio } from "@/components/sharkmo/sharkmo-content-studio";
import { SharkmoHome } from "@/components/sharkmo/sharkmo-home";
import { SharkmoPerformance } from "@/components/sharkmo/sharkmo-performance";
import { SharkmoPhilosophy } from "@/components/sharkmo/sharkmo-philosophy";
import { SharkmoProductLab } from "@/components/sharkmo/sharkmo-product-lab";
import { useSharkmoStore } from "@/lib/sharkmo/use-sharkmo-store";

type SharkmoTab = "SM Home" | "Content Studio" | "Product Lab" | "Filosofia" | "Performance";

const tabs: Array<{ label: SharkmoTab; icon: React.ElementType }> = [
  { label: "SM Home", icon: Home },
  { label: "Content Studio", icon: PenLine },
  { label: "Product Lab", icon: Package },
  { label: "Filosofia", icon: Brain },
  { label: "Performance", icon: BarChart3 },
];

export function SharkmoDashboard() {
  const [activeTab, setActiveTab] = useState<SharkmoTab>("SM Home");
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const store = useSharkmoStore();

  function openFromPriority(area: string, entityId: string) {
    setSelectedEntityId(entityId || null);
    setActiveTab(areaToTab(area));
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] rounded-[2rem] border border-[#d29f22]/10 bg-[#0f0b12] p-3 text-zinc-50 shadow-soft sm:p-5">
      <div className="mb-5 flex gap-2 overflow-x-auto rounded-3xl border border-white/10 bg-[#19121b] p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.label;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => {
                setSelectedEntityId(null);
                setActiveTab(tab.label);
              }}
              className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                active ? "bg-[#d29f22] text-[#19121b]" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
              }`}
            >
              <Icon size={17} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {!store.ready ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-8 text-center text-sm text-zinc-400">
          Caricamento Sharkmo...
        </div>
      ) : (
        <>
          {activeTab === "SM Home" ? <SharkmoHome state={store.state} onOpenPriority={openFromPriority} /> : null}
          {activeTab === "Content Studio" ? (
            <SharkmoContentStudio
              contents={store.activeContents}
              selectedEntityId={selectedEntityId}
              onAdvanceContent={store.advanceContent}
              onUpdateStatus={store.updateContentStatus}
              onSchedule={store.scheduleContent}
            />
          ) : null}
          {activeTab === "Product Lab" ? (
            <SharkmoProductLab
              products={store.activeProducts}
              selectedProductId={selectedEntityId}
              onUpdateProduct={store.updateProduct}
              onUpdateStatus={store.updateProductStatus}
              onUpdateTechPack={store.updateTechPackStatus}
            />
          ) : null}
          {activeTab === "Filosofia" ? (
            <SharkmoPhilosophy
              concepts={store.activeConcepts}
              selectedEntityId={selectedEntityId}
              onTransformToScript={store.transformConceptToScript}
            />
          ) : null}
          {activeTab === "Performance" ? (
            <SharkmoPerformance
              contents={store.state.contents}
              performances={store.state.performances}
              selectedEntityId={selectedEntityId}
              onUpdatePerformance={store.updatePerformance}
              onCreatePerformance={store.createPerformanceForContent}
            />
          ) : null}
        </>
      )}
    </div>
  );
}

function areaToTab(area: string): SharkmoTab {
  if (area === "Product Lab") return "Product Lab";
  if (area === "Filosofia") return "Filosofia";
  if (area === "Performance") return "Performance";
  return "Content Studio";
}
