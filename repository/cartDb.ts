import * as mysql from "mysql";

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

const _moduleTag = "CartRepository_";
class CartRepository {
    public AddItemToCart = async (parma: any) => {

    }

    public DeleteItemOfCart = async (param: any) => {

    }

    public GetInfoOfCart = async (params: any) => {

    }

    public SettleCart = async (params: any) => {

    }
}

export const CartRepositoryInstance = new CartRepository();