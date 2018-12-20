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

const _moduleTag = "UserRepository_";
class UserRepository {
    public Register = async (parma: any) => {

    }

    public Login = async (param: any) => {

    }

    public GetUserProfile = async (params: any) => {

    }

    public GetUserSettleHistory = async (params: any) => {

    }

    public AddUserDeposit = async (params: any) => {

    }

    public GetUserLogs = async (params: any) => {

    }
}

export const UserRepositoryInstance = new UserRepository();