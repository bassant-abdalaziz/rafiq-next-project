export type ProjectPayload = {
  name: string;
  description?: string | null;
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type Member = {
  member_id: string;
  user_id: string;
  role: string;
  metadata: {
    name: string;
    email: string;
    department?: string | null;
  };
};

export type CreateEpicPayload = {
  title: string;
  description?: string | null;
  assignee_id?: string | null;
  project_id: string;
  deadline?: string | null;
};

export type EpicUser = {
  sub: string;
  name: string;
  email: string;
  department?: string | null;
};

export type ProjectEpic = {
  id: string;
  epic_id: string;
  title: string;
  description?: string | null;
  deadline?: string | null;
  created_at: string;
  created_by: EpicUser | null;
  assignee: EpicUser | null;
};

export type UpdateEpicPayload = {
  title?: string;
  description?: string | null;
  assignee_id?: string | null;
  deadline?: string | null;
};

export type TaskStatus =
  | "TO_DO"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "IN_REVIEW"
  | "READY_FOR_QA"
  | "REOPENED"
  | "READY_FOR_PRODUCTION"
  | "DONE";

export type CreateTaskPayload = {
  project_id: string;
  epic_id?: string | null;
  title: string;
  description?: string | null;
  assignee_id?: string | null;
  due_date?: string | null;
  status: TaskStatus;
};

export type TaskPayload = {
  id: string;
  task_id: string;
  title: string;
  description?: string | null;
  status:  TaskStatus;

  project_id: string;
  epic_id: string;

  due_date?: string | null;
  created_at: string;

  assignee: {
    id: string | null;
    name: string | null;
    email: string | null;
    department: string | null;
  } | null;

  created_by: {
    id: string;
    name: string;
    email: string;
    department: string | null;
  } | null;

  epic: {
    id: string;
    title: string;
    epic_id: string;
  } | null;
};

export type TaskView = "list" | "board";

export type TasksArgs = {
  tasks: TaskPayload[];
  loading: boolean;
  error: boolean;
};
