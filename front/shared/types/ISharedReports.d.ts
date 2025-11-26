export interface IUserSharedReports {
  id: string | number;
  user_id: string | number;
  report_id: string | number;
  report?: IReport ;
  user?: IUser;
}
