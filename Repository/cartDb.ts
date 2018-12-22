import * as mysql from "mysql";
import { ShoppingCar } from "../Model/Cart";
import { logger } from "../logger";
import { ItemDetail } from "../Model/Item";

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
    public AddItemsToCart = async (params: ShoppingCar) => {
        const funTag = `${moduleTag}_AddItemToCart`;
        return new Promise<boolean>((resolve) => {
            writablePool.getConnection((err, conn) => {
                conn.beginTransaction(txErr => {
                    if(txErr) {
                        conn.release();
                        return false;
                    }
                    const promises: Promise<boolean>[] = [];
                    params.ItemList.forEach(v => {
                       promises.push(this.AddItemToCart(params.UserId, v, conn));
                    })
                    Promise.all(promises).then((allResult) => {
                        allResult.map(r => {
                            if(r === false) {
                                return conn.rollback(()=> {
                                    conn.release();
                                    return resolve(false);
                                })
                            }
                        });
                        conn.commit((commitErr) => {
                            if(commitErr){
                                return conn.rollback(() => {
                                    conn.release();
                                    return resolve(false);
                                })
                            }
                            conn.release();
                            return resolve(true);
                        })
                    });
                    
                })            
            })
        })
    }

    private AddItemToCart = async (userId: number, item: ItemDetail, conn: mysql.PoolConnection): Promise<boolean> => {
        return new Promise<boolean>((resolve) => {
            conn.query(`INSERT INTO cart_items (user_id, item_id, amount, created_time) 
                        SELECT ${userId}, p.item_id, ${item.Amount}, UNIX_TIMESTAMP() 
                        FROM product_item AS p 
                        WHERE p.item_id = ${item.ItemId} 
                        ON DUPLICATE KEY UPDATE amount = ${item.Amount};`,
                        (err, result) => {
                            if(err) {
                               return resolve(false);
                            }
                            return resolve(true);
                        }) 
        })
    }

    public DeleteItemOfCart = async (param: any) => {

    }

    public GetInfoOfCart = async (params: any) => {

    }

    public SettleCart = async (params: any) => {

    }
}

export const CartRepositoryInstance = new CartRepository();