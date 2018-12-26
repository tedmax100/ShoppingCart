import * as mysql from "mysql";
import { UserProfile } from '../Model/User';
import { logger } from '../logger';
import { StatusEnum } from '../Model/ApiStatus';
import * as _ from "lodash";

const writablePool = mysql.createPool({
    connectionLimit : 10,
    host : "",
    port : ,
    user : "",
    password : "",
    database : "carts",
    multipleStatements : true
});
const readOnlyPool = mysql.createPool({
    connectionLimit : 30,
    host : "carts-cluster.cluster-ro-cq5kxkv5qjb7.ap-northeast-2.rds.amazonaws.com",
    port : 3307,
    user : "carts",
    password : "qwer1234",
    database : "carts",
    multipleStatements : true
});

const moduleTag = "UserRepository_";
class UserRepository {
    public Register = async (params: UserProfile): Promise<[boolean, number, StatusEnum]> => {
        const funTag = `${moduleTag}_Register`;
        return new Promise<[boolean, number ,StatusEnum]>((resolve) => {
            writablePool
            .query(`INSERT INTO user_profile(user_name, account, password, credit, created_time) \
                    VALUES ('${params.UserName}', '${params.Account}', '${params.HashPassword}', ${params.Credit}, UNIX_TIMESTAMP());`, 
                    (err, result) => { 
                        if(err) {
                            logger.error(funTag, {error:err, param: params});
                            if (err.errno === 1062) return resolve([false, 0,StatusEnum.DUPLICATE_ACCOUNT]);
                            return resolve([false, 0, StatusEnum.INTERNAL_SYSTEM_ERROR]);
                        }
                        
                        return resolve([true, result.insertId , StatusEnum.SUCCESS])
                    }
            )   
        })
    }

    public Login = async (params: UserProfile): Promise<[boolean, UserProfile|undefined]> => {
        const funTag = `${moduleTag}_Login`;
        return new Promise<[boolean, UserProfile|undefined]>((resolve) => {
            readOnlyPool
            .query(`SELECT user_id, user_name, account, password, credit 
                    FROM user_profile 
                    WHERE ${params.GetQuerySyntax()};
                    INSERT INTO user_login_log(user_id, created_time)
                    SELECT user_id, UNIX_TIMESTAMP()
                    FROM user_profile 
                    WHERE ${params.GetQuerySyntax()};`, 
                    (err, result) => { 
                        if(err) {
                            logger.error(funTag, {error:err, param: params});
                            return resolve([false, undefined]);
                        }
                        if(result[0].length === 0) return resolve([true,  new UserProfile()]);

                        const dbResult: UserProfile = new UserProfile()
                                .SetAccount(result[0][0].account)
                                .SetCredit(result[0][0].credit)
                                .SetUserName(result[0][0].user_name)
                                .SetUserId(result[0][0].user_id)
                                .SetPassword(result[0][0].password);

                        return resolve([true, dbResult])
                    }
            ) 
                
        })
    }

    public GetUserProfile = async (params: UserProfile): Promise<[boolean, UserProfile|undefined]> => {
        const funTag = `${moduleTag}_GetUserProfile`;
        return new Promise<[boolean, UserProfile|undefined]>((resolve) => {
            readOnlyPool
            .query(`SELECT 
                        p.user_id, user_name, account, credit, p.created_time, MAX(l.created_time) AS last_login_time
                    FROM user_profile AS p
                    LEFT JOIN user_login_log AS l ON p.user_id = l.user_id
                    WHERE p.${params.GetQuerySyntax()}`, 
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
                                .SetCreatedTime(result[0].created_time)
                                .SetLastLoginTime(result[0].last_login_time);

                        return resolve([true, dbResult])
                    }
            ) 
        })
    }

    public GetCheckoutHistory = async (params: UserProfile): Promise<[StatusEnum, any[]]> => {
        return new Promise<[StatusEnum, any[]]>((resolve) => {
            writablePool.query(`SELECT t.order_no, p.item_name, c.amount, p.item_price, t.created_time, c.subtotal
                FROM trans_order AS t 
                INNER JOIN cart_items AS c ON t.order_no = c.order_no
                INNER JOIN product_item AS p ON p.item_id = c.item_id
                WHERE t.user_id = ${params.UserId}`, (checkoutErr, result) => {
                if(checkoutErr) {
                    return resolve([StatusEnum.INTERNAL_SYSTEM_ERROR, []]);
                }
                return resolve([StatusEnum.SUCCESS, result]);
            })
        })
    }

    public AddUserDeposit = async (params: UserProfile, depositAmount: number) => {
        return new Promise<[StatusEnum, UserProfile|undefined]>((resolve) => {
            writablePool.query(`UPDATE user_profile SET credit = credit + ${depositAmount} WHERE user_id = ${params.UserId};
                                SELECT user_id, user_name, account, credit, created_time FROM user_profile WHERE user_id =${params.UserId};
                                INSERT INTO user_log(user_id, action_type, action_value, remark, created_time)
		                        VALUES (${params.UserId}, 3, 'deposit', ${depositAmount}, UNIX_TIMESTAMP());`,
            (err, result) => {
                if(err) {
                    return resolve([StatusEnum.INTERNAL_SYSTEM_ERROR, undefined]);
                }
                if(result[0].affectedRows === 0) return resolve([StatusEnum.USER_NOT_FOUND, undefined]);

                const dbResult: UserProfile = new UserProfile()
                .SetAccount(result[1][0].account)
                .SetCredit(result[1][0].credit)
                .SetUserName(result[1][0].user_name)
                .SetUserId(result[1][0].user_id)
                .SetCreatedTime(result[1][0].created_time);
                return resolve([StatusEnum.SUCCESS, dbResult]);
            })
        })
    }

    public GetUserLogs = async (params: UserProfile) => {
        const funTag = `${moduleTag}_GetUserLogs`;
        return new Promise<[StatusEnum, any[]]> ((resolve) => {
            readOnlyPool.query(`SELECT user_id, action_type, action_value, remark, created_time FROM carts.user_log 
            WHERE user_id = ${params.UserId};`, (err, result) => {
                if(err) {
                    logger.error(funTag, {error:err, param: params});
                    return resolve([StatusEnum.INTERNAL_SYSTEM_ERROR, []]);
                }
                return resolve([StatusEnum.SUCCESS, result]);
            })
        })
    }
}

export const UserRepositoryInstance = new UserRepository();
