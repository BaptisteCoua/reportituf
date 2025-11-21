import type { INotification } from './INotification';

export interface IReport {
  id: number;
  title: string;
  is_opened: 0 | 1;
  created_at: string;
  creator_id: number;
  notifications?: INotification[];
  status?: IStatus;
  subjects?: ISubject[];
  team?: ITeam;
  users?: IUser[];
  creator?: IUser;
}
