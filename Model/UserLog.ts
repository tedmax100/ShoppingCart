import { UserAction } from './UserAction';
export class UserLog {
    private userName: string;
    private account: string;
    private userActionList: UserAction[];

    constructor() {
        this.userName = "";
        this.account = "";
        this.userActionList = [];
    }

    get UserName():string {
        return this.userName;
    }
    public SetUserName = (value:string) => {
        this.userName = value;
        return this;
    }

    get Account(): string {
        return this.account;
    }
    public  SetAccount(value: string) {
        this.account = value;
        return this;
    }

    get Response(): Object {
        return {
            account: this.Account,
            name: this.UserName
        }
    }
}