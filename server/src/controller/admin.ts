import {BaseHttpController, controller, httpGet, httpPost} from 'inversify-express-utils'
import {inject} from 'inversify'
import {CType, IConfig} from '../declaration'
import {PageMemento} from '../memento/page'
import { Request } from 'express'

@controller('/v2/admin')
export class AdminController extends BaseHttpController {
  @inject(CType.Config)
  private config: IConfig
  @inject(CType.Memento.Page)
  private pageMemento: PageMemento

  @httpGet('/client-config')
  private clientConfig () {
    return this.json({
      config: this.config.client
    }, 200)
  }

  @httpPost('/page/set')
  private async pageSet (request: Request) {
    let state = request.body['state']
    await this.pageMemento.setState(state)
    return this.json({ success: true }, 200)
  }

  @httpGet('/page/get')
  private async pageGet () {
    let state = await this.pageMemento.getState()
    return this.json({ state })
  }
}
