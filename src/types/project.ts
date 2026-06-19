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
  role: string;
  metadata: {
    name: string;
    email: string;
    department?: string | null;
  };
};
