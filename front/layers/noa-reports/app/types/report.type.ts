export interface ReportStatus {
  id: number;
  name: string;
  slug: "draft" | "published" | "archived";
}

export interface Team {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Subject {
  id: number;
  label: string;
  description: string;
  priority: {
    id: number;
    name: string;
  };
  stakeholder?: string;
  start_at: string;
  end_at: string;
}

export interface Report {
  id: number;
  title: string;
  status: ReportStatus;
  team: Team;
  subjects: Subject[];
  users: User[];
  creator: User;
  created_at: string;
  updated_at: string;
}

export interface ReportFilters {
  status?: number;
  team?: number;
  reporter?: number;
  date?: Date | string;
  text?: string;
}

export interface ReportFormData {
  title: string;
  team: number;
  shared: number[];
  subjects: SubjectFormData[];
}

export interface SubjectFormData {
  id?: number;
  label: string;
  priority: number;
  stakeholder?: string;
  description: string;
  start_at: string;
  end_at: string;
}
