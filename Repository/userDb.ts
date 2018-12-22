import * as mysql from "mysql";
import { UserProfile } from '../Model/User';
import { logger } from '../logger';
import { UserApiStatus } from '../Model/ApiStatus';
import { OrderDetail } from "../Model/Order";

const writablePool = mysql.createPool({
    connectionLimit : 10,
    host : "carts-cluster.cluster-cq5kxkv5qjb7.ap-northeast-2.rds.amazonaws.com",
    port : 3307,
    user : "carts",
    password : "qwer1234",
    database : "carts"
});

const readOnlyPool = mysql.createPool({
    connectionLimit : 30,
    host : "carts-cluster.cluster-ro-cq5kxkv5qjb7.ap-northeast-2.rds.amazonaws.com",
    port : 3307,
    user : "carts",
    password : "qwer1234",
    database : "carts"
});

const moduleTag = "UserRepository_";
class UserRepository {
    public Register = async (params: UserProfile): Promise<[boolean, number, UserApiStatus]> => {
        const funTag = `${moduleTag}_Register`;
        return new Promise<[boolean, number ,UserApiStatus]>((resolve) => {
            writablePool
            .query("INSERT INTO user_profile(user_name, account, password, credit, created_time) \
                    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP);", 
                    [params.UserName, params.Account, params.Password, params.Credit],
                    (err, result) => { 
                        if(err) {
                            logger.error(funTag, {error:err, param: params});
                            if (err.errno === 1062) return resolve([false, 0,UserApiStatus.DUPLICATE_ACCOUNT]);
                            return resolve([false, 0, UserApiStatus.INTERNAL_SYSTEM_ERROR]);
                        }
                        
                        return resolve([true, result.insertId , UserApiStatus.SUCCESS])
                    }
            )
                
        })
    }

    public Login = async (params: UserProfile): Promise<[boolean, UserProfile|undefined]> => {
        const funTag = `${moduleTag}_Login`;
        return new Promise<[boolean, UserProfile|undefined]>((resolve) => {
            readOnlyPool
            .query("SELECT user_id, user_name, account, password, credit \
                    FROM user_profile \
                    WHERE account = ?;", 
                    [params.Account],
                    (err, result) => { 
                        if(err) {
                            logger.error(funTag, {error:err, param: params});
                            return resolve([false, undefined]);
                        }
                        if(result.length === 0) return resolve([true,  new UserProfile()]);

                        const dbResult: UserProfile = new UserProfile()
                                .SetAccount(result[0].account)
                                .SetCredit(result[0].credit)
                                .SetUserName(result[0].user_name)
                                .SetUserId(result[0].user_id)
                                .SetPassword(result[0].password);

                        return resolve([true, dbResult])
                    }
            ) 
                
        })
    }

    public GetUserProfile = async (params: UserProfile): Promise<[boolean, UserProfile|undefined]> => {
        const funTag = `${moduleTag}_GetUserProfile`;
        return new Promise<[boolean, UserProfile|undefined]>((resolve) => {
            readOnlyPool
            .query("SELECT user_id, user_name, account, credit, created_time \
                    FROM user_profile \
                    WHERE account = ?;", 
                    [params.Account],
                    (err, result) => { 
                        if(err) {
                            logger.error(funTag, {error:err, param: params});
                            return resolve([false, undefined]);
                        }
                        if(result.length === 0) return resolve([true,  new UserProfile()]);

                        const dbResult: UserProfile = new UserProfile()
                                .SetAccount(result[0].account)
                                .SetCredit(result[0].credit)
                                .SetUserName(result[0].user_name)
                                .SetUserId(result[0].user_id)
                                .SetCreatedTime(result[0].created_time);

                        return resolve([true, dbResult])
                    }
            ) 
                
        })
    }

    public GetUserSettleHistory = async (params: UserProfile) => {
        const funTag = `${moduleTag}_GetUserSettleHistory`;
/*         return new Promise<[boolean, undefined]>((resolve) => {
            readOnlyPool
            .query("SELECT u.account, u.user_name, t.order_no, p.item_name, p.item_price, i.amount, t.created_time \
                    FROM carts.user_profile AS u \
                    INNER JOIN carts.trans_order AS t ON u.user_id = t.user_id \
                    INNER JOIN carts.cart_items AS i ON t.order_no = i.order_no \
                    INNER JOIN carts.product_item AS p ON i.item_id = p.item_id \
                    WHERE u.user_id = ?;", 
                    [params.UserId], 
                    (err, result) => {
                        if(err) {
                            logger.error(funTag, {error:err, params});
                            return resolve([false, undefined]);
                        }
                        let orderInfo = new OrderDetail().SetAccount()

                        if(result.length === 0) return resolve([true,  new OrderDetail()]);
                            
                    })
            return resolve([true, undefined])
        }) */
    }

    public AddUserDeposit = async (params: any) => {

    }

    public GetUserLogs = async (params: any) => {

    }
}

export const UserRepositoryInstance = new UserRepository();