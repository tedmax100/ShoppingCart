import {ItemDetail} from "./Item";

export class OrderDetail {
    private orderNo: number;
    private itemList: ItemDetail[];
    private createdTime : number;
    private subtotal: number;

    constructor() {
        this.orderNo = 0;
        this.itemList = [];
        this.createdTime = 0;
        this.itemList = [];
        this.subtotal = 0;
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
        this.subtotal += item.Amount * item.ItemPrice;
    }


    get CreatedTime(): number {
        return this.createdTime;
    }
    public SetCreatedTime = (value: number) => {
        this.createdTime = value;
        return this;
    }

    get Subtotal(): number {

        return this.subtotal;
    }
}