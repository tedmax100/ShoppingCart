import * as mysql from "mysql";
import { ShoppingCar } from "../Model/Cart";
import { logger } from "../logger";
import { ItemDetail } from "../Model/Item";
import {StatusEnum} from "../Model/ApiStatus";
import { UserProfile } from '../Model/User';

const writablePool = mysql.createPool({
    connectionLimit : 10,
    host : "carts-cluster.cluster-cq5kxkv5qjb7.ap-northeast-2.rds.amazonaws.com",
    port : 3307,
    user : "carts",
    password : "qwer1234",
    database : "carts",
    multipleStatements : true
});

const moduleTag = "CartRepository_";
class CartRepository {
    public AddItemToCart = async (userId: number, item: ItemDetail): Promise<StatusEnum> => {
        return new Promise<StatusEnum>((resolve) => {
            writablePool.query(`CALL usp_add_item_to_cart(${userId}, ${item.ItemId}, ${item.Amount})`,
            (err, result) =>{
                if(err) {
                    return resolve(StatusEnum.INTERNAL_SYSTEM_ERROR);
                }
                if(result[0][0].affectedRows === 0) return resolve(StatusEnum.ITEM_NOT_ENOUGH);
                return resolve(StatusEnum.SUCCESS);
            })
        })
    }

    public DeleteItemOfCart = async (userId: number, item: ItemDetail): Promise<StatusEnum> => {
        return new Promise<StatusEnum>((resolve) => {
            writablePool.query(`DELETE FROM carts.cart_items 
                        WHERE user_id = ${userId} AND item_id = ${item.ItemId} AND order_no = 0;
                        INSERT INTO user_log(user_id, action_type, action_value, remark, created_time)
		                VALUES (${userId}, 2, 'delete item', ${item.ItemId}, UNIX_TIMESTAMP());`,
                        (err, result) => {
                            if(err) {
                               return resolve(StatusEnum.INTERNAL_SYSTEM_ERROR);
                            }
                            if(result.affectedRows === 0) return resolve(StatusEnum.ITEM_NOT_ENOUGH);
                            return resolve(StatusEnum.SUCCESS);
                        }) 
        })
    }

    public GetItemsOfCart = async (params: UserProfile) => {
        return new Promise<[StatusEnum, any[]]>((resolve) => {
            writablePool.query(`SELECT p.item_id, p.item_name, p.item_price, c.amount, c.created_time, c.subtotal 
                                FROM cart_items AS c
                                INNER JOIN product_item  AS p ON c.item_id = p.item_id
                                WHERE c.user_id = ${params.UserId} AND order_no = 0;`,
                        (err, result) => {
                            if(err) {
                               return resolve([StatusEnum.INTERNAL_SYSTEM_ERROR, []]);
                            }
                            return resolve([StatusEnum.SUCCESS, result]);
                        }) 
        })
    }

    public Checkout = async (params: ShoppingCar) => {
        return new Promise<StatusEnum>((resolve) => {
            writablePool.query(`CALL usp_checkout(${params.UserId})`, (checkoutErr, result) => {
                if(checkoutErr) {
                    return resolve(StatusEnum.INTERNAL_SYSTEM_ERROR);
                }
                if(result[1].affectedRows === 0) return resolve(StatusEnum.ITEM_NOT_ENOUGH);
                return resolve(StatusEnum.SUCCESS);
            })
        })
    }
}

export const CartRepositoryInstance = new CartRepository();