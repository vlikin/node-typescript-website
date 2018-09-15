import {inject, injectable} from "inversify";
import {AbstactAdminRoute, AbstractRoute, EMethod, IRouteInfo} from "./core/route";
import {NextFunction, Request, Response} from "express";
import {CType, IConfig} from "./declaration";

@injectable()
export class TestRoute extends AbstractRoute {
    @inject(CType.Config)
    private config!: IConfig;

    constructor() {
        super();
    }

    info(): IRouteInfo {
        return {
            path: '/test',
            method: EMethod.get
        }
    }

    router(request: Request, response: Response, next: NextFunction): any {
        response.send(`Hello route ${this.config.server.port}`);
    }
}

@injectable()
export class ClientConfigAdminRoute extends AbstactAdminRoute {
    constructor() {
        super();
    }

    info(): IRouteInfo {
        return {
            path: '/admin/client-config',
            method: EMethod.get
        }
    }

    router(request: Request, response: Response, next: NextFunction): any {
        response.json({
            config: this.config.client
        });
    }
}