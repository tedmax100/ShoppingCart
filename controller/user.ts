import { Request, Response, Router } from "express";

const _moduleTag = "UserController";

export class UserController {
    public router: Router;
    constructor() {
        this.router = Router();
        this.init();
    }

    public init() {
        this.router.post("/register", this.Register);
        this.router.post("/login",  this.Login);
        this.router.get("/user_profile",  this.GetUserProfile);
        this.router.get("/settle_history", this.GetSettleHistory);
        this.router.post("/deposit", this.Deposit);
        this.router.get("/logs", this.GetLogs);
    }

    private Register = async (req: Request, res: Response) => {
        return res.status(200).send();
    }

    private Login = async (req: Request, res: Response) => {
        return res.status(200).send();
    }

    private GetUserProfile = async (req: Request, res: Response) => {
        return res.status(200).send();
    }

    private GetSettleHistory = async (req: Request, res: Response) => {
        return res.status(200).send();
    }

    private Deposit = async (req: Request, res: Response) => {
        return res.status(200).send();
    }

    private GetLogs = async (req: Request, res: Response) => {
        return res.status(200).send();
    }
}

const userController = new UserController();
export let userRouter: Router = userController.router;
