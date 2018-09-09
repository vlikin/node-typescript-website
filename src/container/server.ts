import {inject, injectable, multiInject} from "inversify";
import {IRoute, IRouteInfo} from "../core/route";
import {default as express, NextFunction, Request, Response} from "express";
import {CType, IConfig} from "../declaration";

@injectable()
export class ServerContainer {
    public application: any;

    constructor(
        @inject(CType.Config)
        private config: IConfig,
        @multiInject(CType.IRoute)
        private routes: IRoute[]
    ) {
    }

    build() {
        this.application = express();
        this.routes.forEach((route: IRoute) => {
            let info: IRouteInfo = route.info();
            this.application[info.method](info.path, (request: Request, response: Response, next: NextFunction): any => {
                return route.handler(request, response, next);
            })
        })
    }

    getRoutes(): IRoute[] {
        return this.routes;
    }

    listen() {
        this.application.listen(this.config.server.port, () => {
            console.log(`Example app listening on port ${this.config.server.port}!`);
        });
    }
}