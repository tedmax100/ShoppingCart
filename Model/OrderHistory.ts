import {OrderDetail} from "./Order";

export class OrderHistroy {
    private account: string;
    private name:string;
    private orderList: OrderDetail[];

    constructor() {
        this.account = "";
        this.name = "";
        this.orderList = [];
    }

    get Account(): string {
        return this.account;
    }
    public SetAccount = (value: string) => {
        this.account = value;
        return this;
    }

    get Name(): string {
        return this.name;
    }
    public SetName = (value: string) => {
        this.name = value;
        return this;
    }
    public AddOrder = (item: OrderDetail) => {
        this.orderList.push(item);
    }

    get OrderList(): OrderDetail[] {
        return this.orderList;
    }
    public SetGrderList = (value: OrderDetail[]) => {
        this.orderList = value;
        return this;
    }

    get Response(): Object {
        return {
            account: this.Account,
            name: this.Name,
            order: this.OrderList.map(o => {
                return {
                    order_no:o.OrderNo,
                    created_time: o.CreatedTime,
                    total: o.Total,
                    item_list: o.ItemList.map(i => {
                        return {
                            item_name: i.ItemName,
                            item_price: i.ItemPrice,
                            amount: i.Amount,
                            subtotal: i.Subtoal
                        }
                    })
                }
            })
        }
    }
}