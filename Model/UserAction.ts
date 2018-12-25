export class UserAction {
    private actionType?: number;
    private actionValue?: string;
    private createdTime?: number;
    private remarks?: string;

    constructor() {    }

    get ActionType(): number|undefined {
        return this.actionType;
    }
    public  SetActionType(value: number) {
        this.actionType = value;
        return this;
    }

    get ActionValue(): string|undefined {
        return this.actionValue;
    }
    public  SetActionValue(value: string) {
        this.actionValue = value;
        return this;
    }

    get CreatedTime(): number|undefined {
        return this.createdTime;
    }
    public  SetCreatedTime(value: number) {
        this.createdTime = value;
        return this;
    }

    get Remarks(): string|undefined {
        return this.remarks;
    }
    public SetRemarks(value: string) {
        this.remarks = value;
        return this;
    }
}