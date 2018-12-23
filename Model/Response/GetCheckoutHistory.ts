export class GetCheckoutHistory {
    constructor(public user_id: number, public name: string, public credit:number, public created_time: number, public last_login_time: number) {}
}