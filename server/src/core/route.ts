import {inject, injectable} from "inversify";
import {NextFunction, Request, RequestHandler, Response} from 'express';
import _ from 'lodash';
import {CType, IConfig} from "../declaration";
import {CoreContainer} from "../container/core";
import {validate} from "jsonschema";

export enum EMethod {
  get = 'get',
  post = 'post'
}

export interface IRouteInfo {
  path: string,
  method?: EMethod,
  schema?: object
}

export interface IRouteRegister {
  handler: RequestHandler,

  getInfo(): IRouteInfo,
}

export interface IRouteImplementation {
  router: RequestHandler;

  info(): IRouteInfo;
}

export interface IRoute extends IRouteRegister, IRouteImplementation {
}

@injectable()
export abstract class AbstractRoute implements IRoute {
  protected defaultInfo: IRouteInfo = {
    path: 'default',
    method: EMethod.get,
  };

  readonly registeredInfo!: IRouteInfo;

  protected constructor() {
    this.registeredInfo = _.defaultsDeep(this.info(), this.defaultInfo);
  }

  public getInfo(): IRouteInfo {
    return this.registeredInfo;
  }

  public handler(request: Request, response: Response, next: NextFunction): any {
    if (this.registeredInfo.schema) {
      let results = validate(request.body, this.registeredInfo.schema);
      if (!results.valid) {
        let messages = _.invokeMap(results.errors, 'toString');
        response
          .status(403)
          .json({ messages });

        return;
      }
    }

    return this.router(request, response, next);
  }

  public abstract router(request: Request, response: Response, next: NextFunction): any;

  public abstract info(): IRouteInfo;
}

@injectable()
export abstract class AbstactAdminRoute extends AbstractRoute {
  @inject(CType.Config)
  protected config!: IConfig;
  @inject(CType.Core)
  protected coreContainer!: CoreContainer;


  public handler(request: Request, response: Response, next: NextFunction): any {
    let negativeAnswer = (response: Response) => {
      return response
        .status(403)
        .json({
          message: 'The user have to be authorized.'
        });
    };
    let authorizationStr = request.get('Authentication');
    if (authorizationStr) {
      let type = authorizationStr.substr(0, 6);
      if (type == 'bearer') {
        let encryptedToken = authorizationStr.substr(7);
        let data = this.coreContainer.decodeToken(encryptedToken);
        if (data.id == 'admin') {
          return this.router(request, response, next);
        }
      }
    }

    return negativeAnswer(response);
  }
}
