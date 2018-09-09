import {injectable} from "inversify";
import {Application, NextFunction, Request, RequestHandler, Response} from 'express';

export enum EMethod {
    get = 'get',
    post = 'post'
}

export interface IRouteInfo {
    path: string,
    method: EMethod
}

export interface IRoute {
    handler: RequestHandler;
    build(commander: any): void;
    info(): IRouteInfo;
}

@injectable()
export abstract class AbstractRoute implements IRoute {
    public build(application: Application): void {
        let info: IRouteInfo = this.info();
        application[info.method](info.path, (request: Request, response: Response, next: NextFunction) => this.handler(request, response, next));
    }

    public abstract handler(request: Request, response: Response, next: NextFunction): any
    public abstract info(): IRouteInfo
}
