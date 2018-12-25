import { UserProfile } from '../Model/User';

declare namespace Express {
    // tslint:disable-next-line:interface-name
    interface Request {
      token?: string;
      userProfile?: UserProfile;
    }
  }
  