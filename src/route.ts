import {inject, injectable} from "inversify";
import {AbstractRoute, EMethod, IRouteInfo} from "./core/route";
import {NextFunction, Request, Response} from "express";
import {CType, IConfig} from "./declaration";

@injectable()
export class TestRoute extends AbstractRoute {
    constructor(
        @inject(CType.Config)
        private config: IConfig
    ) {
        super();
    }

    info(): IRouteInfo {
        return {
            path: '/test',
            method: EMethod.get
        }
    }

    handler(request: Request, response: Response, next: NextFunction): any {
        response.send(`Hello route ${this.config.server.port}`);
    }
}