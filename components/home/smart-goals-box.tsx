"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { SectionCard } from "@/components/section-card";
import { SmartGoalFormModal } from "@/components/home/smart-goal-form-modal";
import { SmartGoalItem } from "@/components/home/smart-goal-item";
import type { SmartGoal } from "@/lib/kaizen/types";

type SmartGoalValues = {
  title: string;
  targetValue: number;
  currentValue: number;
  deadline: string;
};

type SmartGoalsBoxProps = {
  ready: boolean;
  goals: SmartGoal[];
  onAddGoal: (values: SmartGoalValues) => void;
  onEditGoal: (goalId: string, values: SmartGoalValues) => void;
  onDeleteGoal: (goalId: string) => void;
  onUpdateProgress: (goalId: string, currentValue: number) => void;
};

export function SmartGoalsBox({
  ready,
  goals,
  onAddGoal,
  onEditGoal,
  onDeleteGoal,
  onUpdateProgress,
}: SmartGoalsBoxProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SmartGoal | null>(null);

  function openCreateModal() {
    setEditingGoal(null);
    setModalOpen(true);
  }

  return (
    <SectionCard title="Obiettivi SMART" description="Traguardi misurabili con progresso e scadenza.">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={openCreateModal}
          aria-label="Aggiungi obiettivo SMART"
          className="flex size-11 items-center justify-center rounded-full bg-moss-400 text-ink-950 transition hover:bg-moss-300"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="grid gap-3">
        {!ready ? (
          <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-5 text-sm text-zinc-400">
            Caricamento obiettivi...
          </p>
        ) : goals.length > 0 ? (
          goals
            .slice()
            .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
            .map((goal) => (
              <SmartGoalItem
                key={goal.id}
                goal={goal}
                onEdit={(selectedGoal) => {
                  setEditingGoal(selectedGoal);
                  setModalOpen(true);
                }}
                onDelete={onDeleteGoal}
                onUpdateProgress={onUpdateProgress}
              />
            ))
        ) : (
          <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-5 text-sm leading-6 text-zinc-400">
            Nessun obiettivo attivo. Crea un obiettivo SMART per tracciare un risultato concreto.
          </p>
        )}
      </div>

      {modalOpen ? (
        <SmartGoalFormModal
          goal={editingGoal}
          onClose={() => setModalOpen(false)}
          onSave={(values) => {
            if (editingGoal) {
              onEditGoal(editingGoal.id, values);
            } else {
              onAddGoal(values);
            }

            setModalOpen(false);
          }}
        />
      ) : null}
    </SectionCard>
  );
}
