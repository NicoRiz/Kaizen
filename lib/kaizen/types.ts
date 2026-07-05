export type ItemStatus = "active" | "completed" | "expired";

export type TaskWeight = "primary" | "secondary";

export type KaizenTask = {
  id: string;
  type: "task";
  title: string;
  description: string;
  weight: TaskWeight;
  createdAt: string;
  deadline: string;
  completedAt: string | null;
  archivedAt: string | null;
  status: ItemStatus;
};

export type SmartGoal = {
  id: string;
  type: "goal";
  title: string;
  description: string;
  currentValue: number;
  targetValue: number;
  createdAt: string;
  deadline: string;
  completedAt: string | null;
  archivedAt: string | null;
  status: ItemStatus;
};

export type ArchivedItem = KaizenTask | SmartGoal;

export type KaizenState = {
  tasks: KaizenTask[];
  goals: SmartGoal[];
};
