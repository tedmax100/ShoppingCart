import { Request } from "express";
import { UserApiStatus } from '../Model/ApiStatus';
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
        shoppingCart.AddItem(item);
        const result = await CartRepositoryInstance.AddItemsToCart(shoppingCart);


       /*  if(userProfile.IsInvalidateRegister() === true) return [UserApiStatus.PARAMETER_ERROR, undefined];

        const registerResult = await UserRepositoryInstance.Register(userProfile);
        if(registerResult[0] === false) return [registerResult[2], undefined];

        userProfile.SetUserId(registerResult[1]); */

        return [UserApiStatus.SUCCESS, shoppingCart];
    }

  
}