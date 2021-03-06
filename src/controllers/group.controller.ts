import { Router, Request, Response, NextFunction } from "express"
import { validateMiddleware } from "../middlewares/validateMiddleware";
import { IController } from "../Interfaces";
import Group from "../models/Group";
class GroupController implements IController {
    private path = "/group";
    private _router: Router;
    public get router(): Router {
        return this._router;
    }
    public set router(value: Router) {
        this._router = value;
    }

    constructor() {
        this.router = Router();
        this.initialRouter();

    }
    initialRouter() {
        this.router.get(this.path, this.handleTestEndPoint);
        this.router.post(`${this.path}/create`, validateMiddleware, this.handleCreateGroup);
        this.router.put(`${this.path}/add`, validateMiddleware, this.handleAddNewMember)
        this.router.get(`${this.path}/get/:id`, validateMiddleware, this.handleGetConversation)
    }
    handleTestEndPoint(req: Request, res: Response) {
        res.json("Success")

    }
    handleCreateGroup(req: Request<{}, {}, {
        name: string,
        participants: Array<string>,
        avatar: string
    }>, res: Response, next: NextFunction) {
        const { name, participants, avatar } = req.body;
        const { _id } = req.user;

        Group.createGroupConversation({ creator: _id, name, participants, avatar }).then((result) => {
            res.status(200).json({
                code: 200,
                status: "success",
                message: "Create group successfully!",
                data: result
            })
        })
            .catch(error => {
                res.status(200).json({
                    code: 401,
                    status: "failed",
                    message: "Create group failed!",
                })
            });
    }
    handleAddNewMember(req: Request<{}, {}, { _idConversation: string, _id: Array<string> }>, res: Response, next: NextFunction) {
        const { _idConversation, _id } = req.body;
        Group.addMemberToGroup({ _idConversation, _id }).then((result) => {
            res.status(200).json({
                code: 200,
                status: "success",
                message: "Add member successfully!",
                data: result
            })
        })
            .catch(error => {
                res.status(200).json({
                    code: 401,
                    status: "fail",
                    message: "Add member failed!"
                })
            })
    }
    handleGetConversation(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        const { id } = req.params
        Group.getGroupConversation(id).then((result) => {
            res.status(200).json({
                code: 200,
                status: "success",
                message: "Get group successfully!",
                data: result
            })
        })
            .catch(error => {
                res.status(200).json({
                    code: 401,
                    status: "fail",
                    message: "Get group failed!"
                })
            })
    }
}

export default GroupController;