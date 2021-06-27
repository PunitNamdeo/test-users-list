export interface IUserData {
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

export interface IUsersData extends Array<IUserData>{}
