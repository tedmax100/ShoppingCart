import { Request } from "express";
import { StatusEnum } from '../Model/ApiStatus';
import { ShoppingCar } from "../Model/Cart";
import { ItemDetail } from "../Model/Item";
import {CartRepositoryInstance} from "../Repository/cartDb";

export class CartService {
    public AddItemToCart = async(context: Request) => {
        let shoppingCart = new ShoppingCar()
                           .SetUserId(context.body.user_id);
        let item: ItemDetail = new ItemDetail()
                            .SetItemId(context.body.item_id)
                            .SetAmount(context.body.amount);
        return await CartRepositoryInstance.AddItemToCart(shoppingCart.UserId,item);
    }

    public DeleteItemFromCart = async(context: Request) => {
        let shoppingCart = new ShoppingCar()
                           .SetUserId(context.body.user_id);
        let item: ItemDetail = new ItemDetail()
                            .SetItemId(context.body.item_id);
        return await CartRepositoryInstance.DeleteItemOfCart(shoppingCart.UserId,item);
    }

    public Checkout = async(context: Request) => {
        let shoppingCart = new ShoppingCar()
                           .SetUserId(context.body.user_id);
        return await CartRepositoryInstance.Checkout(shoppingCart);
    }
}