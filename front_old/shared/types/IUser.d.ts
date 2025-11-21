
export interface IUser {
  id: number;
  name: string;
  email: string;
 reports?: IReport[];
 comments?: IComment[];
 notifications?: INotification[];
 userSharedReports?: IUserSharedReports[];
}
