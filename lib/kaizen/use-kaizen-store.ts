"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { KaizenState, KaizenTask, SmartGoal, TaskWeight } from "@/lib/kaizen/types";

const STORAGE_KEY = "kaizen-v0-state";

const initialState: KaizenState = {
  tasks: [],
  goals: [],
};

type TaskInput = {
  title: string;
  weight: TaskWeight;
  durationHours: number;
};

type GoalInput = {
  title: string;
  targetValue: number;
  currentValue: number;
  deadline: string;
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeExpired(state: KaizenState, now = Date.now()) {
  let changed = false;

  const tasks = state.tasks.map((task) => {
    if (task.status === "active" && new Date(task.deadline).getTime() <= now) {
      changed = true;
      return { ...task, status: "expired" as const, completedAt: null };
    }

    return task;
  });

  const goals = state.goals.map((goal) => {
    if (goal.status !== "active") {
      return goal;
    }

    if (goal.currentValue >= goal.targetValue) {
      changed = true;
      return { ...goal, status: "completed" as const, completedAt: goal.completedAt ?? new Date(now).toISOString() };
    }

    if (new Date(goal.deadline).getTime() <= now) {
      changed = true;
      return { ...goal, status: "expired" as const, completedAt: null };
    }

    return goal;
  });

  return changed ? { tasks, goals } : state;
}

function readStoredState() {
  if (typeof window === "undefined") {
    return initialState;
  }

  const rawState = window.localStorage.getItem(STORAGE_KEY);

  if (!rawState) {
    return initialState;
  }

  try {
    const parsed = JSON.parse(rawState) as KaizenState;

    return normalizeExpired({
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      goals: Array.isArray(parsed.goals) ? parsed.goals : [],
    });
  } catch {
    return initialState;
  }
}

export function useKaizenStore() {
  const [state, setState] = useState<KaizenState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(readStoredState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const interval = window.setInterval(() => {
      setState((current) => normalizeExpired(current));
    }, 30000);

    return () => window.clearInterval(interval);
  }, [ready]);

  const updateState = useCallback((updater: (current: KaizenState) => KaizenState) => {
    setState((current) => normalizeExpired(updater(current)));
  }, []);

  const addTask = useCallback((input: TaskInput) => {
    const now = new Date();
    const task: KaizenTask = {
      id: createId(),
      type: "task",
      title: input.title.trim(),
      weight: input.weight,
      createdAt: now.toISOString(),
      deadline: new Date(now.getTime() + input.durationHours * 60 * 60 * 1000).toISOString(),
      completedAt: null,
      status: "active",
    };

    updateState((current) => ({ ...current, tasks: [task, ...current.tasks] }));
  }, [updateState]);

  const editTask = useCallback((taskId: string, input: TaskInput) => {
    const deadline = new Date(Date.now() + input.durationHours * 60 * 60 * 1000).toISOString();

    updateState((current) => ({
      ...current,
      tasks: current.tasks.map((task) => (
        task.id === taskId
          ? { ...task, title: input.title.trim(), weight: input.weight, deadline }
          : task
      )),
    }));
  }, [updateState]);

  const deleteTask = useCallback((taskId: string) => {
    updateState((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => task.id !== taskId),
    }));
  }, [updateState]);

  const completeTask = useCallback((taskId: string) => {
    const now = new Date();

    updateState((current) => ({
      ...current,
      tasks: current.tasks.map((task) => {
        if (task.id !== taskId || task.status !== "active") {
          return task;
        }

        const isOnTime = now.getTime() < new Date(task.deadline).getTime();

        return {
          ...task,
          status: isOnTime ? "completed" : "expired",
          completedAt: isOnTime ? now.toISOString() : null,
        };
      }),
    }));
  }, [updateState]);

  const addGoal = useCallback((input: GoalInput) => {
    const now = new Date();
    const completed = input.currentValue >= input.targetValue && new Date(input.deadline).getTime() > now.getTime();
    const goal: SmartGoal = {
      id: createId(),
      type: "goal",
      title: input.title.trim(),
      currentValue: input.currentValue,
      targetValue: input.targetValue,
      createdAt: now.toISOString(),
      deadline: input.deadline,
      completedAt: completed ? now.toISOString() : null,
      status: completed ? "completed" : "active",
    };

    updateState((current) => ({ ...current, goals: [goal, ...current.goals] }));
  }, [updateState]);

  const editGoal = useCallback((goalId: string, input: GoalInput) => {
    const now = new Date();

    updateState((current) => ({
      ...current,
      goals: current.goals.map((goal) => {
        if (goal.id !== goalId) {
          return goal;
        }

        const completed = input.currentValue >= input.targetValue && new Date(input.deadline).getTime() > now.getTime();

        return {
          ...goal,
          title: input.title.trim(),
          currentValue: input.currentValue,
          targetValue: input.targetValue,
          deadline: input.deadline,
          completedAt: completed ? now.toISOString() : null,
          status: completed ? "completed" : "active",
        };
      }),
    }));
  }, [updateState]);

  const updateGoalProgress = useCallback((goalId: string, currentValue: number) => {
    const now = new Date();

    updateState((current) => ({
      ...current,
      goals: current.goals.map((goal) => {
        if (goal.id !== goalId || goal.status !== "active") {
          return goal;
        }

        const nextValue = Math.min(Math.max(0, currentValue), goal.targetValue);
        const completed = nextValue >= goal.targetValue && now.getTime() < new Date(goal.deadline).getTime();

        return {
          ...goal,
          currentValue: nextValue,
          completedAt: completed ? now.toISOString() : goal.completedAt,
          status: completed ? "completed" : "active",
        };
      }),
    }));
  }, [updateState]);

  const deleteGoal = useCallback((goalId: string) => {
    updateState((current) => ({
      ...current,
      goals: current.goals.filter((goal) => goal.id !== goalId),
    }));
  }, [updateState]);

  const activeTasks = useMemo(() => state.tasks.filter((task) => task.status === "active"), [state.tasks]);
  const activeGoals = useMemo(() => state.goals.filter((goal) => goal.status === "active"), [state.goals]);
  const completedItems = useMemo(
    () => [...state.tasks, ...state.goals].filter((item) => item.status === "completed"),
    [state.tasks, state.goals],
  );
  const expiredItems = useMemo(
    () => [...state.tasks, ...state.goals].filter((item) => item.status === "expired"),
    [state.tasks, state.goals],
  );

  return {
    ready,
    activeTasks,
    activeGoals,
    completedItems,
    expiredItems,
    addTask,
    editTask,
    deleteTask,
    completeTask,
    addGoal,
    editGoal,
    deleteGoal,
    updateGoalProgress,
  };
}
