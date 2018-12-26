export class UserAction {
    private actionType: number;
    private actionValue: string;
    private createdTime: number;
    private remarks: string;

    constructor() {    
        this.actionType = 0;
        this.actionValue = "";
        this.createdTime = 0;
        this.remarks = "";
    }

    get ActionType(): number {
        return this.actionType;
    }
    public  SetActionType(value: number) {
        this.actionType = value;
        return this;
    }

    get ActionValue(): string {
        return this.actionValue;
    }
    public  SetActionValue(value: string) {
        this.actionValue = value;
        return this;
    }

    get CreatedTime(): number {
        return this.createdTime;
    }
    public  SetCreatedTime(value: number) {
        this.createdTime = value;
        return this;
    }

    get Remarks(): string {
        return this.remarks;
    }
    public SetRemarks(value: string) {
        this.remarks = value;
        return this;
    }
}