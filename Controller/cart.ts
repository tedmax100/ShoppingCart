import { Request, Response, Router } from "express";
import { CartService } from "../Service/cartService";
import {StatusEnum} from "../Model/ApiStatus";

const _moduleTag = "CartController";

export class CartController {
    public router: Router;
    private cartService: CartService;

    constructor() {
        this.router = Router();
        this.init();
        this.cartService = new CartService();
    }

    public init() {
        this.router.post("/item/:item", this.AddItemToCart);
        this.router.delete("/item/:item",  this.DeleteItemOfCart);
        this.router.get("/:userId",  this.GetInfoOfCart);
        this.router.post("/checkout", this.SettleCart);

    }

    private AddItemToCart = async (req: Request, res: Response) => {
        const result = await this.cartService.AddItemToCart(req);
        if(result === StatusEnum.SUCCESS) return res.status(200).send();
        if(result === StatusEnum.ITEM_NOT_ENOUGH) return res.status(409).send();
        if(result === StatusEnum.INTERNAL_SYSTEM_ERROR) return res.status(500).send();
    }

    private DeleteItemOfCart = async (req: Request, res: Response) => {
        const result = await this.cartService.DeleteItemFromCart(req);
        if(result === StatusEnum.SUCCESS) return res.status(200).send();
        if(result === StatusEnum.ITEM_NOT_ENOUGH) return res.status(409).send();
        if(result === StatusEnum.INTERNAL_SYSTEM_ERROR) return res.status(500).send();
    }

    private GetInfoOfCart = async (req: Request, res: Response) => {
        const result = await this.cartService.GetItemsOfCart(req);
        if(result[0] === StatusEnum.ITEM_NOT_ENOUGH) return res.status(409).send();
        if(result[0] === StatusEnum.INTERNAL_SYSTEM_ERROR) return res.status(500).send();
        debugger;
        return res.status(200).json(result[1].Response);
    }

    private SettleCart = async (req: Request, res: Response) => {
        const result = await this.cartService.Checkout(req);
        if(result === StatusEnum.SUCCESS) return res.status(200).send();
        if(result === StatusEnum.ITEM_NOT_ENOUGH) return res.status(409).send();
        if(result === StatusEnum.INTERNAL_SYSTEM_ERROR) return res.status(500).send();
        return res.status(200).send();
    }


}

const cartController = new CartController();
export let cartRouter: Router = cartController.router;
