import {inject, injectable} from "inversify";
import {AbstractRoute, EMethod, IRouteInfo} from "../core/route";
import {CType, IConfig} from "../declaration";
import {NextFunction, Request, Response} from "express";
import pug from 'pug';
import _ from 'lodash';
import * as path from "path";
import {PageMemento} from "../memento/page";

@injectable()
export class IndexRoute extends AbstractRoute {
  @inject(CType.Config)
  private config!: IConfig;
  @inject(CType.Memento.Page)
  private pageMemento!: PageMemento;

  constructor() {
    super();
  }

  info(): IRouteInfo {
    return {
      path: '/',
      method: EMethod.get
    }
  }

  async router(request: Request, response: Response, next: NextFunction): Promise<any> {
    let state = await this.pageMemento.getState();
    let options = {};
    let locals = {
      lng: 'en'
    };

    let vars = _.merge(options, locals, state);
    let html = pug.renderFile(path.resolve('./pug/index.pug'), vars);
    response.send(`Hello route ${this.config.server.port} --- ${html}`);

    return null;
  }
}
