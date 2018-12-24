import {ItemDetail} from "./Item";

export class OrderDetail {
    private orderNo: number;
    private itemList: ItemDetail[];
    private createdTime : number;
    private total: number;

    constructor() {
        this.orderNo = 0;
        this.itemList = [];
        this.createdTime = 0;
        this.itemList = [];
        this.total = 0;
    }

    get OrderNo(): number {
        return this.orderNo;
    }
    public SetOrderNo = (value: number) => {
        this.orderNo = value;
        return this;
    }

    get ItemList(): ItemDetail[] {
        return this.itemList;
    }
    public SetItemList = (value: ItemDetail[]) => {
        this.itemList = value;
        return this;
    }
    public AddItem = (item: ItemDetail) => {
        this.itemList.push(item);
        this.total += item.Subtoal;
    }


    get CreatedTime(): number {
        return this.createdTime;
    }
    public SetCreatedTime = (value: number) => {
        this.createdTime = value;
        return this;
    }

    get Total(): number {

        return this.total;
    }

    get Response(): Object {
        return {
            item_list: this.itemList.map(v => {
                return {
                    item_id: v.ItemId,
                    item_name: v.ItemName,
                    item_price: v.ItemPrice,
                    amount: v.Amount,
                    created_time: v.CreatedTime,
                    subtotal: v.Subtoal
                }
            }),
            total: this.total
        }
    }
}