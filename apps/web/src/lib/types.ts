export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
}

export interface IRoomData {
  name: string;
  password: string;
  isPrivate: boolean;
}

export type IRedisMessageEventData = {
  message: string;
  user: any;
  roomId: string;
};
