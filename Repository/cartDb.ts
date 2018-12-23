import * as mysql from "mysql";
import { ShoppingCar } from "../Model/Cart";
import { logger } from "../logger";
import { ItemDetail } from "../Model/Item";
import {StatusEnum} from "../Model/ApiStatus";
import { debug } from "util";

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
                        WHERE user_id = ${userId} AND item_id = ${item.ItemId};`,
                        (err, result) => {
                            if(err) {
                               return resolve(StatusEnum.INTERNAL_SYSTEM_ERROR);
                            }
                            if(result.affectedRows === 0) return resolve(StatusEnum.ITEM_NOT_ENOUGH);
                            return resolve(StatusEnum.SUCCESS);
                        }) 
        })
    }

    public GetInfoOfCart = async (params: any) => {

    }

    public Checkout = async (params: ShoppingCar) => {
        return new Promise<StatusEnum>((resolve) => {
            writablePool.query(`CALL usp_checkout(${params.UserId})`, (checkoutErr, result) => {
                if(checkoutErr) {
                    debugger;
                    return resolve(StatusEnum.INTERNAL_SYSTEM_ERROR);
                }
                if(result[0][0].affectedRows === 0) return resolve(StatusEnum.ITEM_NOT_ENOUGH);
                return resolve(StatusEnum.SUCCESS);
            })
        })
    }
}

export const CartRepositoryInstance = new CartRepository();