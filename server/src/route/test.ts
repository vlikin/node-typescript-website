import {inject, injectable} from "inversify";
import {AbstractRoute, EMethod, IRouteInfo} from "../core/route";
import {CType, IConfig} from "../declaration";
import {NextFunction, Request, Response} from "express";

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
      method: EMethod.post,
      schema: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email'
          }
        }
      }
    }
  }

  router(request: Request, response: Response, next: NextFunction): any {
    response.send(`Hello route ${this.config.server.port}`);
  }
}
