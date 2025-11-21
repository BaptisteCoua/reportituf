export interface IComment {
  id?: number;
  content: string;
  user_id: string;
  created_at: string;
  user: IUser;
  subject: ISubject;
  notifications: INotification[];
}
