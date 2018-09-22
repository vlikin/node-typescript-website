import {inject, injectable} from "inversify";
import {AbstractRoute, EMethod, IRouteInfo} from "../core/route";
import {CType, IDynamicConfig, ITokenData} from "../declaration";
import {DynamicConfigMemento} from "../memento";
import {CoreContainer} from "../container/core";
import {NextFunction, Request, Response} from "express";

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