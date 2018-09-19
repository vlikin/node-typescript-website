import {inject, injectable} from "inversify";
import {AbstactAdminRoute, AbstractRoute, EMethod, IRouteInfo} from "./core/route";
import {NextFunction, Request, Response} from "express";
import {CType, IConfig, IDynamicConfig, ITokenData} from "./declaration";
import {CoreContainer} from "./container/core";
import {DynamicConfigMemento} from "./memento";

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

@injectable()
export class GetTokenRoute extends AbstractRoute {
  @inject(CType.Memento.DynamicConfig)
  private dynamicConfigMemento!: DynamicConfigMemento;
  @inject(CType.Core)
  private coreContainer!: CoreContainer;

  constructor()
   {
    super();
  }

  info(): IRouteInfo {
    return {
      path: '/get-token',
      method: EMethod.post
    }
  }

  async router(request: Request, response: Response, next: NextFunction) {
    let password = request.body['password'];
    let hash = this.coreContainer.generateHash(password);
    let state: IDynamicConfig = await this.dynamicConfigMemento.getState();
    if (state.adminPassword == password) {
      let tokenData: ITokenData = {
        id: 'admin'
      };
      let token = this.coreContainer.generateToken(tokenData);
      response.json({token});
    }
    else {
      response
        .status(202)
        .json({message: 'Wrong authentication data.'})
    }
  }


}