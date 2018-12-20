import * as bcrypt from "bcrypt";

export class UserProfile {
    constructor(private account: string, private password: string, private name: string, private　credit: number) {
        if(this.password == null || this.password.length < 8) this.password = "";
        else this.password = bcrypt.hashSync(this.password, 5);
    }

    get Account(): string {
        return this.account;
    }
    set Account(value: string) {
        this.account = value;
    }

    get Password(): string {
        return this.password;
    } 
/*     set Password(value: string) {
        if(value.length < 6) this.password = "";
        else {
            let hashPwd = await bcrypt.hash(value, 5);
            this.password = hashPwd;
        }
    } */
    get Name():string {
        return this.name;
    }
    set Name(value: string) {
        this.name = value;
    }
    get Credit(): number {
        return this.credit;
    }

    public IsInValidate = (): boolean => {
        return this.Account == null 
            && this.Password == null
            && this.Name == null
            && this.credit == null;
    }
}