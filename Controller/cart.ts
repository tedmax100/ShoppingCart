import { Request, Response, Router } from "express";
import { CartService } from "../Service/cartService";
import {StatusEnum} from "../Model/ApiStatus";
import { logger } from '../logger';
import { checkUser } from '../Middleware/checkUser';
const moduleTag = "CartController";

export class CartController {
    public router: Router;
    private cartService: CartService;

    constructor() {
        this.router = Router();
        this.init();
        this.cartService = new CartService();
    }

    public init() {
        this.router.post("/item", checkUser, this.AddItemToCart);
        this.router.delete("/item", checkUser,this.DeleteItemOfCart);
        this.router.get("/cart_items", checkUser, this.GetInfoOfCart);
        this.router.post("/checkout", checkUser, this.Checkout);

    }

    private AddItemToCart = async (req: Request, res: Response) => {
        const funTag = `${moduleTag}_AddItemToCart`;
        try{
            const result = await this.cartService.AddItemToCart(req);
            if(result === StatusEnum.ITEM_NOT_ENOUGH) return res.status(409).send();
            if(result === StatusEnum.INTERNAL_SYSTEM_ERROR) return res.status(500).send();
            return res.status(200).send();
        }catch(err) {
            logger.error(funTag, {error: err, request: req.body});
            return res.status(500).send();
        }
    }

    private DeleteItemOfCart = async (req: Request, res: Response) => {
        const funTag = `${moduleTag}_DeleteItemOfCart`;
        try{
            const result = await this.cartService.DeleteItemFromCart(req);
            if(result === StatusEnum.ITEM_NOT_ENOUGH) return res.status(409).send();
            if(result === StatusEnum.INTERNAL_SYSTEM_ERROR) return res.status(500).send();
            return res.status(200).send();
        }catch(err) {
            logger.error(funTag, {error: err, request: req.body});
            return res.status(500).send();
        }   
    }

    private GetInfoOfCart = async (req: Request, res: Response) => {
        const funTag = `${moduleTag}_GetInfoOfCart`;
        try{
            const result = await this.cartService.GetItemsOfCart(req);
            if(result[0] === StatusEnum.ITEM_NOT_ENOUGH) return res.status(409).send();
            if(result[0] === StatusEnum.INTERNAL_SYSTEM_ERROR) return res.status(500).send();
            return res.status(200).json(result[1].Response);
        }catch(err) {
            logger.error(funTag, {error: err, request: req.body});
            return res.status(500).send();
        }   
    }

    private Checkout = async (req: Request, res: Response) => {
        const funTag = `${moduleTag}_Checkout`;
        try{
            const result = await this.cartService.Checkout(req);
            if(result === StatusEnum.ITEM_NOT_ENOUGH) return res.status(409).send();
            if(result === StatusEnum.INTERNAL_SYSTEM_ERROR) return res.status(500).send();
            return res.status(200).send();
        }catch(err) {
            logger.error(funTag, {error: err, request: req.body});
            return res.status(500).send();
        }     
    }
}

const cartController = new CartController();
export let cartRouter: Router = cartController.router;
