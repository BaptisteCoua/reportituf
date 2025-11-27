export interface Priority {
  id: number;
  name: string;
  color?: string;
}

export interface SubjectComment {
  id: number;
  content: string;
  author: {
    id: number;
    name: string;
  };
  created_at: string;
}
