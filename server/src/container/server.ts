import { inject, injectable } from 'inversify'
import { default as express, NextFunction, Request, Response, Application } from 'express'
import { CType, IConfig } from '../declaration'
import BodyParser from 'body-parser'
import fileUpload from 'express-fileupload'

@injectable()
export class ServerContainer {

  constructor (
    @inject(CType.App)
    private application: Application,
    @inject(CType.Config)
    private config: IConfig
  ) {
  }

  build () {
    this.application.use(fileUpload())
    this.application.use(BodyParser.json())

    // Rewrites urls that can come from Ng client.
    this.application.all(/\/server(.*)/, (request: Request, response: Response, next: NextFunction) => {
      request.url = request.url.replace(/\/server(.*)/, '$1')
      next()
    })

    /**
     * Setup statics.
     * Mostly it is used for development and testing purpose.
     */
    let staticConfigs = this.config.static
    for (let staticConfig of staticConfigs) {
      this.application.use(staticConfig.path, express.static(staticConfig.dir))
    }
  }

  listen () {
    this.application.listen(this.config.server.port, () => {
      console.log(`Example app listening on port ${this.config.server.port}!`)
    })
  }
}
