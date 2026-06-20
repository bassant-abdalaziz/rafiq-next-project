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
