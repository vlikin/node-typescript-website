import {inject, injectable, multiInject} from "inversify";
import {IRoute, IRouteInfo, IRouteRegister} from "../core/route";
import {default as express, NextFunction, Request, Response, Application, IRouterMatcher} from "express";
import {CType, IConfig} from "../declaration";
import BodyParser from 'body-parser';

@injectable()
export class ServerContainer {
    public application!: Application;

    constructor(
        @inject(CType.Config)
        private config: IConfig,
        @multiInject(CType.IRoute)
        private routes: IRoute[]
    ) {
    }

    build() {
        this.application = express();
        this.application.use(BodyParser.json());
        this.routes.forEach((route: IRouteRegister) => {
            let info: IRouteInfo = route.getInfo();
            this.application[info.method!](info.path, (request: Request, response: Response, next: NextFunction): any => {
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