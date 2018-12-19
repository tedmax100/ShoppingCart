import { Request, Response, Router } from "express";

const _moduleTag = "CartController";

export class CartController {
    public router: Router;
    constructor() {
        this.router = Router();
        this.init();
    }

    public init() {
        this.router.post("/:cart_id/item/:item", this.AddItemToCart);
        this.router.delete("/:cart_id/item/:item",  this.DeleteItemOfCart);
        this.router.get("/:cart_id",  this.GetInfoOfCart);
        this.router.post("/:cart_id/settle", this.SettleCart);
    }

    private AddItemToCart = async (req: Request, res: Response) => {
        return res.status(200).send();
    }

    private DeleteItemOfCart = async (req: Request, res: Response) => {
        return res.status(200).send();
    }

    private GetInfoOfCart = async (req: Request, res: Response) => {
        return res.status(200).send();
    }

    private SettleCart = async (req: Request, res: Response) => {
        return res.status(200).send();
    }
}

const cartController = new CartController();
export let cartRouter: Router = cartController.router;
