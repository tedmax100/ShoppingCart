import { Request } from "express";
import { StatusEnum } from '../Model/ApiStatus';
import { ShoppingCar } from "../Model/Cart";
import { ItemDetail } from "../Model/Item";
import {CartRepositoryInstance} from "../Repository/cartDb";
import { UserProfile } from '../Model/User';
import { OrderDetail } from '../Model/Order';

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

    public GetItemsOfCart = async(context: Request): Promise<[StatusEnum, OrderDetail]> => {
        let userProfile = new UserProfile()
                            .SetUserId(context.body.user_id);
        const result = await CartRepositoryInstance.GetItemsOfCart(userProfile);
        const order = new OrderDetail();
        if(result[0] === StatusEnum.SUCCESS) {
            result[1].map(v => {
                const itemDetail = new ItemDetail();
                itemDetail.SetItemId(v.item_id)
                    .SetItemName(v.item_name)
                    .SetItemPrice(v.item_price)
                    .SetAmount(v.amount)
                    .SetCreatedTime(v.created_time)
                    .SetSubtoal(v.subtotal);
                order.AddItem(itemDetail);
            })
        }
        return [result[0], order];

    }
}