export interface INotification {
  id: string;
  type: "commented" | "created";
  notifiable_type: string;
  notifiable_id: number;
  data: {
    model_type: string;
    report_id: number;
    comment_id?: number;
    text: string;
    user_name: string;
    user_id: number;
  };
  read_at: string | null;
  created_at: string;
  updated_at: string;
  user?: IUser;
}
