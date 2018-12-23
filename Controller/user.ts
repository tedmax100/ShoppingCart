import { Request, Response, Router } from "express";
import {UserService} from "../Service/userService";
import { StatusEnum } from '../Model/ApiStatus';
import { Login } from '../Model/Response/Login';
import { GetUserProfile } from '../Model/Response/GetUserProfile';
const _moduleTag = "UserController";

export class UserController {
    public router: Router;
    private userService: UserService;

    constructor() {
        this.router = Router();
        this.init();
        this.userService = new UserService();
    }

    public init() {
        this.router.post("/register", this.Register);
        this.router.post("/login",  this.Login);
        this.router.get("/user_profile",  this.GetUserProfile);
        this.router.get("/:user_id/checkout_history", this.GetSettleHistory);
        this.router.post("/deposit", this.Deposit);
        this.router.get("/logs", this.GetLogs);
    }

    private Register = async (req: Request, res: Response) => {
        const result = await this.userService.Register(req);
        if (result[0] === StatusEnum.INTERNAL_SYSTEM_ERROR) return res.status(500).send();

        if (result[0] === StatusEnum.DUPLICATE_ACCOUNT) return res.status(409).send();
 
        return res.status(200).json(new Login(result[1]!.UserId, result[1]!.UserName));
    }

    private Login = async (req: Request, res: Response) => {
        const result = await this.userService.Login(req);
        if (result[0] === StatusEnum.INTERNAL_SYSTEM_ERROR) return res.status(500).send();

        if (result[0] === StatusEnum.USER_NOT_FOUND || result[0] === StatusEnum.PASSWORD_ERROR) return res.status(401).send();

        return res.status(200).json(new Login(result[1]!.UserId, result[1]!.UserName));
    }

    private GetUserProfile = async (req: Request, res: Response) => {
        const result = await this.userService.GetUserProfile(req);
        if (result[0] === StatusEnum.INTERNAL_SYSTEM_ERROR) return res.status(500).send();

        if (result[0] === StatusEnum.USER_NOT_FOUND ) return res.status(401).send();

        return res.status(200).json(new GetUserProfile(result[1]!.UserId, result[1]!.UserName, result[1]!.Credit, result[1]!.CreatedTime, 0));
    }


    private Deposit = async (req: Request, res: Response) => {
        return res.status(200).send();
    }

    private GetLogs = async (req: Request, res: Response) => {
        return res.status(200).send();
    }

    private GetSettleHistory = async (req: Request, res: Response) => {
        const result = await this.userService.GetCheckoutHistory(req);
        if (result[0] === StatusEnum.INTERNAL_SYSTEM_ERROR) return res.status(500).send();

        if (result[0] === StatusEnum.USER_NOT_FOUND ) return res.status(401).send();

        return res.status(200).json(result[1]!.Response);
    }
}

const userController = new UserController();
export let userRouter: Router = userController.router;
