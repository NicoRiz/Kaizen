"use client";

import { PageHeader } from "@/components/page-header";
import { SmartGoalsBox } from "@/components/home/smart-goals-box";
import { TodoListBox } from "@/components/home/todo-list-box";
import { useKaizenStore } from "@/lib/kaizen/use-kaizen-store";

export function HomeDashboard() {
  const store = useKaizenStore();

  return (
    <div className="space-y-6">
      <PageHeader
        label="Home"
        title="Panoramica della giornata"
        description="Gestisci task attive, obiettivi SMART e progressi che finiscono automaticamente in archivio."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <TodoListBox
          ready={store.ready}
          tasks={store.activeTasks}
          onAddTask={store.addTask}
          onEditTask={store.editTask}
          onCompleteTask={store.completeTask}
          onDeleteTask={store.deleteTask}
        />
        <SmartGoalsBox
          ready={store.ready}
          goals={store.activeGoals}
          onAddGoal={store.addGoal}
          onEditGoal={store.editGoal}
          onDeleteGoal={store.deleteGoal}
          onUpdateProgress={store.updateGoalProgress}
        />
      </div>
    </div>
  );
}
