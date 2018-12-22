import { ItemDetail } from "./Item";

export class ShoppingCar {
    private userId: number;
    private itemList: ItemDetail[];

    constructor() {
        this.userId = 0;
        this.itemList = [];
    }

    get UserId() : number {
        return this.userId;
    }
    public SetUserId = (value: number) => {
        this.userId = value;
        return this;
    }

    get ItemList() : ItemDetail[] {
        return this.itemList;
    }
    public AddItem = (itemDetail: ItemDetail) => this.itemList.push(itemDetail);

    public IsInvalidateRegister = (): boolean => this.UserId == 0;

    public IsNullObject = (): boolean => this.userId === 0;
}