export class ItemDetail {
    private itemName: string;
    private itemId: number;
    private itemPrice: number;
    private amount: number;
    private subtotal: number;

    constructor(){
        this.itemName = "";
        this.itemId = 0;
        this.itemPrice = 0;
        this.amount = 0;
        this.subtotal = 0 ; 
    }

    get ItemName(): string {
        return this.itemName;
    }
    public SetItemName = (value: string) => {
        this.itemName = value;
        return this;
    }

    get ItemId(): number {
        return this.itemId;
    }
    public SetItemId = (value: number) => {
        this.itemId = value;
        return this;
    }

    get ItemPrice(): number {
        return this.itemPrice;
    }
    public SetItemPrice = (value: number) => {
        this.itemPrice = value;
        return this;
    }

    get Amount(): number {
        return this.amount;
    }
    public SetAmount = (value: number) => {
        this.amount = value;
        return this;
    }

    get Subtotal(): number {
        return this.subtotal;
    }
    public SetSubtotal = (value: number) => {
        this.subtotal = value;
        return this;
    }
}