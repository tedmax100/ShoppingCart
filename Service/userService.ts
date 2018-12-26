import {UserRepositoryInstance} from "../Repository/userDb";
import { Request } from "express";
import { UserProfile } from '../Model/User';
import * as bcrypt from 'bcrypt';
import { StatusEnum } from '../Model/ApiStatus';
import * as _ from "lodash";
import { OrderDetail } from "../Model/Order";
import { ItemDetail } from '../Model/Item';
import { OrderHistroy } from '../Model/OrderHistory';
import { UserLog } from "../Model/UserLog";
import { UserAction } from "../Model/UserAction";

export class UserService {
    public Register = async(context: Request): Promise<[StatusEnum, UserProfile|undefined]> => {
        let userProfile = new UserProfile()
                            .SetAccount(context.body.account)
                            .SetHashPassword(context.body.password)
                            .SetUserName(context.body.name)
                            .SetCredit(context.body.credit);

        if(userProfile.IsInvalidateRegister() === true) return [StatusEnum.PARAMETER_ERROR, undefined];

        const registerResult = await UserRepositoryInstance.Register(userProfile);
        if(registerResult[0] === false) return [registerResult[2], undefined];

        userProfile.SetUserId(registerResult[1]);

        return [StatusEnum.SUCCESS, userProfile];
    }

    public Login = async(context: Request): Promise<[StatusEnum, UserProfile|undefined]> =>　{
        let userProfile = new UserProfile()
                            .SetAccount(context.body.account)
                            .SetPassword(context.body.password);
        if(userProfile.Account == "" || userProfile.Password == "") return [StatusEnum.PARAMETER_ERROR, undefined];

        let userProfileDb = await UserRepositoryInstance.Login(userProfile);
        
        if(userProfileDb[0] === false) return [StatusEnum.INTERNAL_SYSTEM_ERROR, undefined];
        
        if(userProfileDb[1]!.IsNullObject()) return [StatusEnum.USER_NOT_FOUND, undefined];

        let pwdCompare = await bcrypt.compare(userProfile.Password, userProfileDb[1]!.Password);
        if(pwdCompare === false) return [StatusEnum.PASSWORD_ERROR, undefined];

        return [StatusEnum.SUCCESS, userProfileDb[1]];
    }

    public GetUserProfile = async(context: Request): Promise<[StatusEnum, UserProfile|undefined]> =>　{
        let userProfile = new UserProfile()
                            .SetAccount(context.body.account)
        if(userProfile.Account == "") return [StatusEnum.PARAMETER_ERROR, undefined];

        let userProfileDb = await UserRepositoryInstance.GetUserProfile(userProfile);
        
        if(userProfileDb[0] === false) return [StatusEnum.INTERNAL_SYSTEM_ERROR, undefined];
        
        if(userProfileDb[1]!.IsNullObject()) return [StatusEnum.USER_NOT_FOUND, undefined];

        return [StatusEnum.SUCCESS, userProfileDb[1]!];
    }

    public GetCheckoutHistory = async(context: Request): Promise<[StatusEnum, OrderHistroy|undefined]> => {
        let userProfile = new UserProfile()
                           .SetUserId((context.userProfile as UserProfile).UserId)
                           .SetAccount((context.userProfile as UserProfile).Account)
                           .SetUserName((context.userProfile as UserProfile).UserName);
        
       /*  let userProfileDb = await UserRepositoryInstance.GetUserProfile(userProfile);
        if(userProfileDb[0] === false) return [StatusEnum.INTERNAL_SYSTEM_ERROR, undefined]; */
        
        const orderHistroy: OrderHistroy = new OrderHistroy()
            .SetAccount(userProfile.Account)
            .SetName(userProfile.UserName);

        let checkoutHistory = await UserRepositoryInstance.GetCheckoutHistory(userProfile);
        let orderGroup = _.groupBy(checkoutHistory[1], "order_no");
        _.map(orderGroup, (group) => {
            const order = new OrderDetail()
                .SetOrderNo(group[0].order_no)
                .SetCreatedTime(group[0].created_time);

            _.map(group, (item) => {
                const itemDetail = new ItemDetail()
                    .SetItemName(item.item_name)
                    .SetAmount(item.amount)
                    .SetItemPrice(item.item_price)
                    .SetSubtoal(item.subtotal);

                order.AddItem(itemDetail); 
            });
            orderHistroy.AddOrder(order);
        });

        return [StatusEnum.SUCCESS, orderHistroy];
    }

    public AddUserDeposit = async(context: Request): Promise<[StatusEnum, UserProfile|undefined]> =>　{
        let userProfile = new UserProfile()
                            .SetUserId(context.body.user_id);

        return await UserRepositoryInstance.AddUserDeposit(userProfile, parseInt(context.body.amount));
    }

    public GetLogs = async(context: Request): Promise<[StatusEnum, UserLog]> =>　{
        let userProfile = new UserProfile()
                            .SetAccount((context.userProfile as UserProfile).Account)
                            .SetUserId((context.userProfile as UserProfile).UserId)
                            .SetUserName((context.userProfile as UserProfile).UserName);

        if(userProfile.Account == "") return [StatusEnum.PARAMETER_ERROR, new UserLog()];

        let dbResult = await UserRepositoryInstance.GetUserLogs(userProfile);

        if(dbResult[0] === StatusEnum.INTERNAL_SYSTEM_ERROR) {
            return [StatusEnum.INTERNAL_SYSTEM_ERROR,  new UserLog()];
        }
        const userLog: UserLog = new UserLog().SetAccount(userProfile.Account).SetUserName(userProfile.UserName);

        dbResult[1].map(v => {
            const userAction: UserAction = new UserAction()
            .SetActionType(v.action_type)
            .SetActionValue(v.action_value)
            .SetRemarks(v.remark)
            .SetCreatedTime(v.created_time);
            userLog.AddAction(userAction);
        })
        return [StatusEnum.SUCCESS, userLog];
    }
}