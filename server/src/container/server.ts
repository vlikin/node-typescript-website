import {inject, injectable, multiInject} from 'inversify';
import {IRoute, IRouteInfo, IRouteRegister} from '../core/route';
import {default as express, NextFunction, Request, Response, Application} from 'express';
import {CType, IConfig} from '../declaration';
import BodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

//declare function fileUpload(options?: fileUpload.Options): express.RequestHandler;

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
    this.application.use(fileUpload());
    this.application.use(BodyParser.json());

    // Rewrites urls that can come from Ng client.
    this.application.all(/\/server(.*)/, (request: Request, response: Response, next: NextFunction) => {
      request.url = request.url.replace(/\/server(.*)/, '$1');
      next();
    });

    /**
     * Setup statics.
     * Mostly it is used for development and testing purpose.
     */
    let staticConfigs = this.config.static;
    for(let staticConfig of staticConfigs) {
      this.application.use(staticConfig.path, express.static(staticConfig.dir));
    }


    // Registers routes.
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