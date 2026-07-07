"use client";

import { useEffect, useState } from "react";
import { Package, X } from "lucide-react";
import { SharkmoBadge, SharkmoButton, SharkmoField, SharkmoPanel, sharkmoInputClass } from "@/components/sharkmo/sharkmo-ui";
import type { ProductItem, ProductStatus, TechPackStatus } from "@/lib/sharkmo/types";

type SharkmoProductLabProps = {
  products: ProductItem[];
  selectedProductId?: string | null;
  onUpdateProduct: (product: ProductItem) => void;
  onUpdateStatus: (productId: string, status: ProductStatus) => void;
  onUpdateTechPack: (productId: string, status: TechPackStatus, fileUrl?: string) => void;
};

const productStatuses: ProductStatus[] = ["Idea", "Concept", "Design", "Mockup", "Tech pack in corso", "Tech pack completato", "Campione richiesto", "Campione ricevuto", "Revisione", "Pronto produzione", "Archiviato"];
const techPackStatuses: TechPackStatus[] = ["Mancante", "In corso", "Allegato", "Completato", "Da revisionare"];

export function SharkmoProductLab({ products, selectedProductId, onUpdateProduct, onUpdateStatus, onUpdateTechPack }: SharkmoProductLabProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  useEffect(() => {
    if (!selectedProductId) {
      return;
    }

    const product = products.find((item) => item.id === selectedProductId);
    if (product) {
      setSelectedProduct(product);
    }
  }, [products, selectedProductId]);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    const updatedProduct = products.find((item) => item.id === selectedProduct.id);
    if (updatedProduct) {
      setSelectedProduct(updatedProduct);
    }
  }, [products, selectedProduct]);

  return (
    <div className="space-y-5">
      <SharkmoPanel>
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#d29f22]">Product Lab</p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-50">Capi, mockup e tech pack</h1>
      </SharkmoPanel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => setSelectedProduct(product)}
            className="overflow-hidden rounded-3xl border border-white/10 bg-[#19121b] text-left shadow-soft transition hover:border-[#d29f22]/45"
          >
            {product.previewImageUrl ? (
              <div
                aria-label={product.name}
                className="aspect-[4/3] w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${product.previewImageUrl})` }}
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(210,159,34,0.25),transparent_35%),linear-gradient(135deg,#5d0018,#252628)]">
                <Package className="text-[#d29f22]" size={42} />
              </div>
            )}
            <div className="p-5">
              <div className="flex flex-wrap gap-2">
                <SharkmoBadge>{product.category}</SharkmoBadge>
                <SharkmoBadge tone="dark">{product.status}</SharkmoBadge>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-zinc-50">{product.name}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{product.nextAction}</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-[#d29f22]" style={{ width: `${getProductProgress(product.status)}%` }} />
              </div>
              <p className="mt-3 text-xs text-zinc-500">Tech pack: {product.techPackStatus}</p>
            </div>
          </button>
        ))}
      </div>

      {selectedProduct ? (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdateProduct={(product) => {
            onUpdateProduct(product);
            setSelectedProduct(product);
          }}
          onUpdateStatus={(status) => {
            onUpdateStatus(selectedProduct.id, status);
            setSelectedProduct({
              ...selectedProduct,
              status,
              techPackStatus: status === "Tech pack completato" ? "Completato" : selectedProduct.techPackStatus,
            });
          }}
          onUpdateTechPack={(status, fileUrl) => {
            onUpdateTechPack(selectedProduct.id, status, fileUrl);
            setSelectedProduct({ ...selectedProduct, techPackStatus: status, techPackFileUrl: fileUrl ?? selectedProduct.techPackFileUrl });
          }}
        />
      ) : null}
    </div>
  );
}

function ProductModal({
  product,
  onClose,
  onUpdateProduct,
  onUpdateStatus,
  onUpdateTechPack,
}: {
  product: ProductItem;
  onClose: () => void;
  onUpdateProduct: (product: ProductItem) => void;
  onUpdateStatus: (status: ProductStatus) => void;
  onUpdateTechPack: (status: TechPackStatus, fileUrl?: string) => void;
}) {
  const [draft, setDraft] = useState(product);

  useEffect(() => {
    setDraft(product);
  }, [product]);

  function handleStatusChange(status: ProductStatus) {
    const nextDraft = {
      ...draft,
      status,
      techPackStatus: status === "Tech pack completato" ? "Completato" as const : draft.techPackStatus,
    };

    setDraft(nextDraft);
    onUpdateStatus(status);
  }

  function handleTechPackChange(status: TechPackStatus, fileUrl?: string) {
    const nextDraft = {
      ...draft,
      techPackStatus: status,
      techPackFileUrl: fileUrl ?? draft.techPackFileUrl,
    };

    setDraft(nextDraft);
    onUpdateTechPack(status, fileUrl);
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-md">
      <div className="flex min-h-dvh items-end justify-center p-4 sm:items-center">
        <section className="max-h-[90dvh] w-full overflow-hidden rounded-3xl border border-[#d29f22]/20 bg-[#19121b] shadow-soft sm:max-w-5xl">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#d29f22]">Product Lab</p>
              <h2 className="mt-2 text-xl font-semibold text-zinc-50">{draft.name}</h2>
            </div>
            <button onClick={onClose} className="flex size-10 items-center justify-center rounded-full border border-white/10 text-zinc-300 hover:bg-white/5">
              <X size={18} />
            </button>
          </div>

          <div className="max-h-[calc(90dvh-6rem)] overflow-y-auto p-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <SharkmoPanel>
                <h3 className="mb-4 text-lg font-semibold text-zinc-50">Generale</h3>
                <div className="grid gap-4">
                  <SharkmoField label="Nome"><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
                  <SharkmoField label="Stato">
                    <select value={draft.status} onChange={(e) => handleStatusChange(e.target.value as ProductStatus)} className={sharkmoInputClass}>
                      {productStatuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </SharkmoField>
                  <SharkmoField label="Concept"><textarea value={draft.concept} onChange={(e) => setDraft({ ...draft, concept: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
                  <SharkmoField label="Target"><input value={draft.target} onChange={(e) => setDraft({ ...draft, target: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
                  <SharkmoField label="Prossima azione"><input value={draft.nextAction} onChange={(e) => setDraft({ ...draft, nextAction: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
                </div>
              </SharkmoPanel>

              <SharkmoPanel>
                <h3 className="mb-4 text-lg font-semibold text-zinc-50">Design</h3>
                <div className="grid gap-4">
                  <SharkmoField label="Colori"><input value={draft.colors} onChange={(e) => setDraft({ ...draft, colors: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
                  <SharkmoField label="Materiali"><input value={draft.materials} onChange={(e) => setDraft({ ...draft, materials: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
                  <SharkmoField label="Fit"><input value={draft.fit} onChange={(e) => setDraft({ ...draft, fit: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
                  <SharkmoField label="Dettagli design"><textarea value={draft.designDetails} onChange={(e) => setDraft({ ...draft, designDetails: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
                  <SharkmoField label="Logo / patch"><textarea value={`${draft.logoPlacement}\n${draft.patchDetails}`} onChange={(e) => setDraft({ ...draft, logoPlacement: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
                </div>
              </SharkmoPanel>

              <SharkmoPanel>
                <h3 className="mb-4 text-lg font-semibold text-zinc-50">Tech Pack</h3>
                <div className="grid gap-4">
                  <SharkmoField label="Status tech pack">
                    <select value={draft.techPackStatus} onChange={(e) => handleTechPackChange(e.target.value as TechPackStatus)} className={sharkmoInputClass}>
                      {techPackStatuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </SharkmoField>
                  <SharkmoField label="File tech pack simulato">
                    <input
                      placeholder="tech-pack-jeans-v1.pdf"
                      defaultValue={draft.techPackFileUrl}
                      onBlur={(e) => e.target.value ? handleTechPackChange("Allegato", e.target.value) : undefined}
                      className={sharkmoInputClass}
                    />
                  </SharkmoField>
                  <p className="text-sm leading-6 text-zinc-400">Materiali, misure e note produzione restano qui finche non collegherai un backend file reale.</p>
                </div>
              </SharkmoPanel>

              <SharkmoPanel>
                <h3 className="mb-4 text-lg font-semibold text-zinc-50">Note e storico</h3>
                <SharkmoField label="Note"><textarea value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-400">
                  Creazione: {new Date(draft.createdAt).toLocaleDateString("it-IT")}<br />
                  Ultimo cambio stato: {new Date(draft.lastStatusChangeAt).toLocaleDateString("it-IT")}
                </div>
              </SharkmoPanel>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <SharkmoButton variant="ghost" onClick={onClose}>Chiudi</SharkmoButton>
              <SharkmoButton onClick={() => onUpdateProduct(draft)}>Salva modifiche</SharkmoButton>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function getProductProgress(status: ProductStatus) {
  const index = productStatuses.indexOf(status);
  return Math.max(8, Math.round((index / (productStatuses.length - 2)) * 100));
}
