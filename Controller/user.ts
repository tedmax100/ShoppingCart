import { Request, Response, Router } from "express";
import {UserService} from "../Service/userService";
import { StatusEnum } from '../Model/ApiStatus';
import { logger } from '../logger';
import { checkUser } from '../Middleware/checkUser';
const moduleTag = "UserController";

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
        this.router.get("/user_profile",checkUser, this.GetUserProfile);
        this.router.get("/checkout_history",checkUser, this.GetCheckoutHistory);
        this.router.post("/deposit",checkUser, this.Deposit);
        this.router.get("/logs",checkUser, this.GetLogs);
    }

    private Register = async (req: Request, res: Response) => {
        const fugTag = `${moduleTag}_Register`;
        try{
            const result = await this.userService.Register(req);
            if (result[0] === StatusEnum.INTERNAL_SYSTEM_ERROR) return res.status(500).send();

            if (result[0] === StatusEnum.DUPLICATE_ACCOUNT) return res.status(409).send();
    
            return res.status(200).json(result[1]!.LoginResponse);
        }catch(err) {
            logger.error(fugTag, {error: err, request: req.body});
            return res.status(500).send();
        }
    }

    private Login = async (req: Request, res: Response) => {
        const fugTag = `${moduleTag}_Login`;
        try{
            const result = await this.userService.Login(req);
    
            if (result[0] === StatusEnum.INTERNAL_SYSTEM_ERROR) return res.status(500).send();
    
            if (result[0] === StatusEnum.USER_NOT_FOUND || result[0] === StatusEnum.PASSWORD_ERROR) return res.status(401).send();
    
            return res.status(200).json(result[1]!.LoginResponse);
        }catch(err) {
            logger.error(fugTag, {error: err, request: req.body});
            return res.status(500).send();
        }
    }

    private GetUserProfile = async (req: Request, res: Response) => {
        const fugTag = `${moduleTag}_GetUserProfile`;
        try{
            const result = await this.userService.GetUserProfile(req);
            if (result[0] === StatusEnum.INTERNAL_SYSTEM_ERROR) return res.status(500).send();
    
            if (result[0] === StatusEnum.USER_NOT_FOUND ) return res.status(401).send();
    
            return res.status(200).json(result[1]!.Response);
        }catch(err) {
            logger.error(fugTag, {error: err, request: req.body});
            return res.status(500).send();
        }
    }


    private Deposit = async (req: Request, res: Response) => {
        const fugTag = `${moduleTag}_Deposit`;
        try{
            const result = await this.userService.AddUserDeposit(req);
            if (result[0] === StatusEnum.INTERNAL_SYSTEM_ERROR) return res.status(500).send();
    
            if (result[0] === StatusEnum.USER_NOT_FOUND ) return res.status(401).send();
    
            return res.status(200).json(result[1]!.Response);
        }catch(err) {
            logger.error(fugTag, {error: err, request: req.body});
            return res.status(500).send();
        }
    }

    private GetLogs = async (req: Request, res: Response) => {
        const fugTag = `${moduleTag}_GetLogs`;
        try{
            const result = await this.userService.GetLogs(req);
            if (result[0] === StatusEnum.INTERNAL_SYSTEM_ERROR) return res.status(500).send();

            return res.status(200).json(result[1]!.Response);
        }catch(err) {
            logger.error(fugTag, {error: err, request: req.body});
            return res.status(500).send();
        }
    }

    private GetCheckoutHistory = async (req: Request, res: Response) => {
        const fugTag = `${moduleTag}_GetCheckoutHistory`;
        try{
            const result = await this.userService.GetCheckoutHistory(req);
            if (result[0] === StatusEnum.INTERNAL_SYSTEM_ERROR) return res.status(500).send();
    
            if (result[0] === StatusEnum.USER_NOT_FOUND ) return res.status(401).send();
    
            return res.status(200).json(result[1]!.Response);
        }catch(err) {
            logger.error(fugTag, {error: err, request: req.body});
            return res.status(500).send();
        }
    }
}

const userController = new UserController();
export let userRouter: Router = userController.router;
