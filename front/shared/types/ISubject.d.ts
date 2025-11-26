export interface ISubject {
  id: number;
  subject: string;
  label: string;
  description: string;
  stakeholder: string;
  start_at: string;
  end_at: string;
  report?: IReport;
  priority?: IPriority;
  comments?: ICommentEntry[];
}
