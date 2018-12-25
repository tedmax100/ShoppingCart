import * as bcrypt from 'bcrypt';
export class UserProfile {
    private userId: number;
    private account: string;
    private password: string;
    private hashPassword: string;
    private userName: string;
    private credit: number;
    private createdTime: number;
    private lastLoginTime: number;
    
    constructor() {
        this.userId = 0;
        this.account = "";
        this.password = "";
        this.hashPassword = "";
        this.userName = "";
        this.credit = 0;
        this.createdTime = 0;
        this.lastLoginTime = 0;
    }

    get UserId() : number {
        return this.userId;
    }
    public SetUserId = (value: number) => {
        this.userId = value;
        return this;
    }

    get Account(): string {
        return this.account;
    }
    public  SetAccount(value: string) {
        this.account = value;
        return this;
    }

    get Password(): string {
        return this.password;
    } 
    public SetPassword(value: string) {
        if(value.length < 8) this.password = "";
        else this.password = value;
        return this;
    }
    
    get HashPassword(): string {
        return this.hashPassword;
    }
    public SetHashPassword(value: string) {
        if(value.length < 8) this.password = "";
        else this.password = bcrypt.hashSync(value, 5);
        return this;
    } 
    get UserName():string {
        return this.userName;
    }
    public SetUserName(value: string) {
        this.userName = value;
        return this;
    }
    get Credit(): number {
        return this.credit;
    }

    public SetCredit = (value: number) => {
        this.credit = value;
        return this;
    }

    get CreatedTime(): number {
        return this.createdTime;
    }

    public SetCreatedTime = (value: number) => {
        this.createdTime = value;
        return this;
    }

    get LastLoginTime(): number {
        return this.lastLoginTime;
    }

    public SetLastLoginTime = (value: number) => {
        this.lastLoginTime = value;
        return this;
    }

    public IsInvalidateRegister = (): boolean => {
        return this.Account == null 
            && this.Password == null
            && this.UserName == null
            && this.credit == null;
    }

    public IsNullObject = (): boolean => this.account === "" || this.UserId === 0;

    public GetQuerySyntax = (): string => this.account === "" ? `user_id = ${this.userId}` : `account = '${this.account}'`;
}