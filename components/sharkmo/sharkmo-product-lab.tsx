"use client";

import { useEffect, useState } from "react";
import { Package, Plus } from "lucide-react";
import { SharkmoBadge, SharkmoButton, SharkmoField, SharkmoModal, SharkmoPanel, sharkmoInputClass } from "@/components/sharkmo/sharkmo-ui";
import type { ProductCategory, ProductItem, ProductStatus, TechPackStatus } from "@/lib/sharkmo/types";
import type { ProductDraftInput } from "@/lib/sharkmo/use-sharkmo-store";

type SharkmoProductLabProps = {
  products: ProductItem[];
  selectedProductId?: string | null;
  onCreateProduct: (input: ProductDraftInput) => string;
  onUpdateProduct: (product: ProductItem) => void;
  onDeleteProduct: (productId: string) => void;
  onArchiveProduct: (productId: string) => void;
  onUpdateStatus: (productId: string, status: ProductStatus) => void;
  onUpdateTechPack: (productId: string, status: TechPackStatus, fileUrl?: string) => void;
};

const productStatuses: ProductStatus[] = ["Idea", "Concept", "Design", "Mockup", "Tech pack in corso", "Tech pack completato", "Campione richiesto", "Campione ricevuto", "Revisione", "Pronto produzione", "Archiviato"];
const productCategories: ProductCategory[] = ["Jeans", "Felpa", "T-shirt", "Giacca", "Pantaloni", "Accessorio", "Scarpe", "Altro"];
const techPackStatuses: TechPackStatus[] = ["Mancante", "In corso", "Allegato", "Completato", "Da revisionare"];

const emptyProductDraft: ProductDraftInput = {
  name: "",
  category: "Altro",
  status: "Idea",
  previewImageUrl: "",
  concept: "",
  target: "",
  useCase: "",
  colors: "",
  materials: "",
  fit: "",
  designDetails: "",
  logoPlacement: "",
  patchDetails: "",
  accessories: "",
  techPackStatus: "Mancante",
  techPackFileUrl: "",
  notes: "",
  nextAction: "",
};

function daysSince(value: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / (24 * 60 * 60 * 1000)));
}

function isBlocked(product: ProductItem) {
  return product.status !== "Archiviato" && daysSince(product.lastStatusChangeAt) >= 5;
}

export function SharkmoProductLab({
  products,
  selectedProductId,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onArchiveProduct,
  onUpdateStatus,
  onUpdateTechPack,
}: SharkmoProductLabProps) {
  const [modal, setModal] = useState<{ mode: "create"; draft: ProductDraftInput } | { mode: "edit"; draft: ProductItem } | null>(null);

  useEffect(() => {
    if (!selectedProductId) return;
    const product = products.find((item) => item.id === selectedProductId);
    if (product) setModal({ mode: "edit", draft: product });
  }, [products, selectedProductId]);

  function saveModal() {
    if (!modal || !modal.draft.name.trim()) return;
    if (modal.mode === "create") {
      onCreateProduct({ ...modal.draft, name: modal.draft.name.trim() });
    } else {
      onUpdateProduct({ ...modal.draft, name: modal.draft.name.trim() });
    }
    setModal(null);
  }

  function confirmDelete(product: ProductItem) {
    if (window.confirm("Sei sicuro di voler eliminare questo prodotto? Questa azione non si puo annullare.")) {
      onDeleteProduct(product.id);
      setModal(null);
    }
  }

  return (
    <div className="space-y-5">
      <SharkmoPanel>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#d29f22]">Product Lab</p>
            <h1 className="mt-3 text-3xl font-semibold text-zinc-50">Capi, mockup e tech pack</h1>
          </div>
          <SharkmoButton onClick={() => setModal({ mode: "create", draft: emptyProductDraft })}><Plus size={16} /> Nuovo prodotto</SharkmoButton>
        </div>
      </SharkmoPanel>

      {products.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const blocked = isBlocked(product);
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => setModal({ mode: "edit", draft: product })}
                className={`overflow-hidden rounded-3xl border bg-[#19121b] text-left shadow-soft transition hover:border-[#d29f22]/45 ${blocked || selectedProductId === product.id ? "border-[#d29f22]/70" : "border-white/10"}`}
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
                    {blocked ? <SharkmoBadge tone="red">Bloccato</SharkmoBadge> : null}
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-zinc-50">{product.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{product.nextAction || "Nessuna prossima azione inserita."}</p>
                  {blocked ? <p className="mt-2 text-xs text-rose-100">Fermo da {daysSince(product.lastStatusChangeAt)} giorni</p> : null}
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full bg-[#d29f22]" style={{ width: `${getProductProgress(product.status)}%` }} />
                  </div>
                  <p className="mt-3 text-xs text-zinc-500">Tech pack: {product.techPackStatus}</p>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <SharkmoPanel>
          <p className="text-sm text-zinc-400">Nessun prodotto nel Product Lab.</p>
          <div className="mt-4">
            <SharkmoButton onClick={() => setModal({ mode: "create", draft: emptyProductDraft })}>Nuovo prodotto</SharkmoButton>
          </div>
        </SharkmoPanel>
      )}

      {modal ? (
        <ProductModal
          modal={modal}
          onDraftChange={(next) => setModal(next)}
          onClose={() => setModal(null)}
          onSave={saveModal}
          onArchive={(product) => {
            onArchiveProduct(product.id);
            setModal(null);
          }}
          onDelete={confirmDelete}
          onUpdateStatus={(product, status) => {
            const nextDraft = {
              ...product,
              status,
              techPackStatus: status === "Tech pack completato" ? "Completato" as const : product.techPackStatus,
            };
            setModal({ mode: "edit", draft: nextDraft });
            onUpdateStatus(product.id, status);
          }}
          onUpdateTechPack={(product, status, fileUrl) => {
            const nextDraft = { ...product, techPackStatus: status, techPackFileUrl: fileUrl ?? product.techPackFileUrl };
            setModal({ mode: "edit", draft: nextDraft });
            onUpdateTechPack(product.id, status, fileUrl);
          }}
        />
      ) : null}
    </div>
  );
}

function ProductModal({
  modal,
  onDraftChange,
  onClose,
  onSave,
  onArchive,
  onDelete,
  onUpdateStatus,
  onUpdateTechPack,
}: {
  modal: { mode: "create"; draft: ProductDraftInput } | { mode: "edit"; draft: ProductItem };
  onDraftChange: (modal: { mode: "create"; draft: ProductDraftInput } | { mode: "edit"; draft: ProductItem }) => void;
  onClose: () => void;
  onSave: () => void;
  onArchive: (product: ProductItem) => void;
  onDelete: (product: ProductItem) => void;
  onUpdateStatus: (product: ProductItem, status: ProductStatus) => void;
  onUpdateTechPack: (product: ProductItem, status: TechPackStatus, fileUrl?: string) => void;
}) {
  const draft = modal.draft;
  const editProduct = modal.mode === "edit" ? modal.draft : null;

  function setDraft(next: typeof draft) {
    onDraftChange(modal.mode === "create" ? { mode: "create", draft: next as ProductDraftInput } : { mode: "edit", draft: next as ProductItem });
  }

  return (
    <SharkmoModal
      eyebrow="Product Lab"
      title={modal.mode === "create" ? "Nuovo prodotto" : draft.name}
      onClose={onClose}
      footer={(
        <>
          {editProduct ? <SharkmoButton variant="danger" onClick={() => onDelete(editProduct)}>Elimina prodotto</SharkmoButton> : null}
          {editProduct ? <SharkmoButton variant="ghost" onClick={() => onArchive(editProduct)}>Archivia</SharkmoButton> : null}
          <SharkmoButton variant="ghost" onClick={onClose}>Chiudi</SharkmoButton>
          <SharkmoButton onClick={onSave} disabled={!draft.name.trim()}>Salva modifiche</SharkmoButton>
        </>
      )}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <SharkmoPanel>
          <h3 className="mb-4 text-lg font-semibold text-zinc-50">Generale</h3>
          <div className="grid gap-4">
            <SharkmoField label="Nome"><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            <div className="grid gap-4 sm:grid-cols-2">
              <SharkmoField label="Categoria">
                <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as ProductCategory })} className={sharkmoInputClass}>
                  {productCategories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </SharkmoField>
              <SharkmoField label="Stato iniziale">
                <select
                  value={draft.status}
                  onChange={(e) => {
                    const status = e.target.value as ProductStatus;
                    if (editProduct) onUpdateStatus(editProduct, status);
                    else setDraft({ ...draft, status });
                  }}
                  className={sharkmoInputClass}
                >
                  {productStatuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              </SharkmoField>
            </div>
            <SharkmoField label="Immagine anteprima URL opzionale"><input value={draft.previewImageUrl ?? ""} onChange={(e) => setDraft({ ...draft, previewImageUrl: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            <SharkmoField label="Concept"><textarea value={draft.concept ?? ""} onChange={(e) => setDraft({ ...draft, concept: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            <SharkmoField label="Target"><input value={draft.target ?? ""} onChange={(e) => setDraft({ ...draft, target: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            <SharkmoField label="Use case"><input value={draft.useCase ?? ""} onChange={(e) => setDraft({ ...draft, useCase: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            <SharkmoField label="Prossima azione"><input value={draft.nextAction ?? ""} onChange={(e) => setDraft({ ...draft, nextAction: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
          </div>
        </SharkmoPanel>

        <SharkmoPanel>
          <h3 className="mb-4 text-lg font-semibold text-zinc-50">Design</h3>
          <div className="grid gap-4">
            <SharkmoField label="Colori"><input value={draft.colors ?? ""} onChange={(e) => setDraft({ ...draft, colors: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            <SharkmoField label="Materiali"><input value={draft.materials ?? ""} onChange={(e) => setDraft({ ...draft, materials: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            <SharkmoField label="Fit"><input value={draft.fit ?? ""} onChange={(e) => setDraft({ ...draft, fit: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            <SharkmoField label="Dettagli design"><textarea value={draft.designDetails ?? ""} onChange={(e) => setDraft({ ...draft, designDetails: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            <SharkmoField label="Logo placement"><textarea value={draft.logoPlacement ?? ""} onChange={(e) => setDraft({ ...draft, logoPlacement: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            <SharkmoField label="Patch details"><textarea value={draft.patchDetails ?? ""} onChange={(e) => setDraft({ ...draft, patchDetails: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
            <SharkmoField label="Accessori"><input value={draft.accessories ?? ""} onChange={(e) => setDraft({ ...draft, accessories: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
          </div>
        </SharkmoPanel>

        <SharkmoPanel>
          <h3 className="mb-4 text-lg font-semibold text-zinc-50">Tech Pack</h3>
          <div className="grid gap-4">
            <SharkmoField label="Tech pack status">
              <select
                value={draft.techPackStatus}
                onChange={(e) => {
                  const status = e.target.value as TechPackStatus;
                  if (editProduct) onUpdateTechPack(editProduct, status);
                  else setDraft({ ...draft, techPackStatus: status });
                }}
                className={sharkmoInputClass}
              >
                {techPackStatuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </SharkmoField>
            <SharkmoField label="File tech pack simulato">
              <input
                value={draft.techPackFileUrl ?? ""}
                onChange={(e) => setDraft({ ...draft, techPackFileUrl: e.target.value })}
                onBlur={(e) => editProduct && e.target.value ? onUpdateTechPack(editProduct, "Allegato", e.target.value) : undefined}
                className={sharkmoInputClass}
              />
            </SharkmoField>
          </div>
        </SharkmoPanel>

        <SharkmoPanel>
          <h3 className="mb-4 text-lg font-semibold text-zinc-50">Note</h3>
          <SharkmoField label="Note"><textarea value={draft.notes ?? ""} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} className={sharkmoInputClass} /></SharkmoField>
          {editProduct ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-400">
              Creazione: {new Date(editProduct.createdAt).toLocaleDateString("it-IT")}<br />
              Ultimo cambio stato: {new Date(editProduct.lastStatusChangeAt).toLocaleDateString("it-IT")}
            </div>
          ) : null}
        </SharkmoPanel>
      </div>
    </SharkmoModal>
  );
}

function getProductProgress(status: ProductStatus) {
  const index = Math.max(0, productStatuses.indexOf(status));
  return Math.max(8, Math.min(100, Math.round((index / (productStatuses.length - 2)) * 100)));
}
