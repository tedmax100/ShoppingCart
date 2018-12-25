import {NextFunction, Request, RequestHandler, Response} from "express";
import createError from "http-errors";
import { isNullOrUndefined } from "util";
import {UserRepositoryInstance} from "../Repository/userDb";
import { UserProfile } from '../Model/User';

export const checkUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const userId = req.params.userId || req.body.user_id || 0;
        const account = req.body.account || "";
        if(userId === 0 && account === "") return res.status(401).send("Unauthorized");

        if(userId == isNullOrUndefined) return res.status(401).send("Unauthorized");
        const userProfile = new UserProfile().SetUserId(userId).SetAccount(account);
        const repository = await UserRepositoryInstance.GetUserProfile(userProfile);

        if(repository[0] === false) return res.status(500).send();
        if(isNullOrUndefined(repository[1]) ) return res.status(401).send();
        req.user = repository[1]!;
        return next();
    }catch(exp) {
        return  next(createError(500));
    };
}