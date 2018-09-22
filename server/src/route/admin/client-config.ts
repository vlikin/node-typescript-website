import {injectable} from "inversify";
import {AbstactAdminRoute, EMethod, IRouteInfo} from "../../core/route";
import {NextFunction, Request, Response} from "express";

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