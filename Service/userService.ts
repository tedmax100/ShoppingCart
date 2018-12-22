import {UserRepositoryInstance} from "../Repository/userDb";
import { Request } from "express";
import { UserProfile } from '../Model/User';
import * as bcrypt from 'bcrypt';
import { UserApiStatus } from '../Model/ApiStatus';

export class UserService {
    public Register = async(context: Request): Promise<[UserApiStatus, UserProfile|undefined]> => {
        let userProfile = new UserProfile()
                            .SetAccount(context.body.account)
                            .SetPassword(context.body.password)
                            .SetUserName(context.body.name)
                            .SetCredit(context.body.credit);

        if(userProfile.IsInvalidateRegister() === true) return [UserApiStatus.PARAMETER_ERROR, undefined];

        const registerResult = await UserRepositoryInstance.Register(userProfile);
        if(registerResult[0] === false) return [registerResult[2], undefined];

        userProfile.SetUserId(registerResult[1]);

        return [UserApiStatus.SUCCESS, userProfile];
    }

    public Login = async(context: Request): Promise<[UserApiStatus, UserProfile|undefined]> =>　{
        let userProfile = new UserProfile()
                            .SetAccount(context.body.account)
                            .SetPassword(context.body.password);
        if(userProfile.Account == "" || userProfile.Password == "") return [UserApiStatus.PARAMETER_ERROR, undefined];

        let userProfileDb = await UserRepositoryInstance.Login(userProfile);
        
        if(userProfileDb[0] === false) return [UserApiStatus.INTERNAL_SYSTEM_ERROR, undefined];
        
        if(userProfileDb[1]!.IsNullObject()) return [UserApiStatus.USER_NOT_FOUND, undefined];

        let pwdCompare = await bcrypt.compare(userProfile.Password, userProfileDb[1]!.Password);
        if(pwdCompare === false) return [UserApiStatus.PASSWORD_ERROR, undefined];

        return [UserApiStatus.SUCCESS, userProfile];
    }

    public GetUserProfile = async(context: Request): Promise<[UserApiStatus, UserProfile|undefined]> =>　{
        let userProfile = new UserProfile()
                            .SetAccount(context.body.account)
        if(userProfile.Account == "") return [UserApiStatus.PARAMETER_ERROR, undefined];

        let userProfileDb = await UserRepositoryInstance.GetUserProfile(userProfile);
        
        if(userProfileDb[0] === false) return [UserApiStatus.INTERNAL_SYSTEM_ERROR, undefined];
        
        if(userProfileDb[1]!.IsNullObject()) return [UserApiStatus.USER_NOT_FOUND, undefined];

        return [UserApiStatus.SUCCESS, userProfileDb[1]!];
    }

    public GetUserSettleHistory = async(context: Request): Promise<[UserApiStatus, UserProfile|undefined]> =>　{
        // step 1 : check userid exist
        // step 2 : get history 

        let userProfile = new UserProfile()
                            .SetUserId(context.body.user_id);

        if(userProfile.UserId == 0) return [UserApiStatus.PARAMETER_ERROR, undefined];

        let userProfileDb = await UserRepositoryInstance.GetUserProfile(userProfile);
        
        if(userProfileDb[0] === false) return [UserApiStatus.INTERNAL_SYSTEM_ERROR, undefined];
        
        if(userProfileDb[1]!.IsNullObject()) return [UserApiStatus.USER_NOT_FOUND, undefined];

        return [UserApiStatus.SUCCESS, userProfileDb[1]!];
    }

    public AddUserDeposit = async(context: Request): Promise<[UserApiStatus, UserProfile|undefined]> =>　{
        // step 1 : check userid exist
        // step 2 : add deposit 

        let userProfile = new UserProfile()
                            .SetAccount(context.body.account)
        if(userProfile.Account == "") return [UserApiStatus.PARAMETER_ERROR, undefined];

        let userProfileDb = await UserRepositoryInstance.GetUserProfile(userProfile);
        
        if(userProfileDb[0] === false) return [UserApiStatus.INTERNAL_SYSTEM_ERROR, undefined];
        
        if(userProfileDb[1]!.IsNullObject()) return [UserApiStatus.USER_NOT_FOUND, undefined];

        return [UserApiStatus.SUCCESS, userProfileDb[1]!];
    }

    public GetLogs = async(context: Request): Promise<[UserApiStatus, UserProfile|undefined]> =>　{
        // step 1 : check userid exist
        // step 2 : get logs 

        let userProfile = new UserProfile()
                            .SetAccount(context.body.account)
        if(userProfile.Account == "") return [UserApiStatus.PARAMETER_ERROR, undefined];

        let userProfileDb = await UserRepositoryInstance.GetUserProfile(userProfile);
        
        if(userProfileDb[0] === false) return [UserApiStatus.INTERNAL_SYSTEM_ERROR, undefined];
        
        if(userProfileDb[1]!.IsNullObject()) return [UserApiStatus.USER_NOT_FOUND, undefined];

        return [UserApiStatus.SUCCESS, userProfileDb[1]!];
    }
}