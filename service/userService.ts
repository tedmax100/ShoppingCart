import {UserRepositoryInstance} from "../repository/userDb";
import { Request } from "express";
import {UserProfile} from "../Model/User";

export class UserService {
    public Register = async(context: Request) => {
        let userProfile = new UserProfile(context.body.account, context.body.password, context.body.name, context.body.credit);
        if(userProfile.IsInValidate() === true) return false;
        await UserRepositoryInstance.Register(userProfile);
        console.dir(userProfile.IsInValidate());
        return true;
    }
}