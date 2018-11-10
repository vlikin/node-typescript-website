import { inject, injectable } from 'inversify'
import { AbstactAdminRoute, EMethod, IRouteInfo } from '../../core/route'
import { CType } from '../../declaration'
import { NextFunction, Request, Response } from 'express'
import { PageMemento } from '../../memento/page'

@injectable()
export class PageGetAdminRoute extends AbstactAdminRoute {
  @inject(CType.Memento.Page)
  protected pageMemento!: PageMemento

  constructor () {
    super()
  }

  info (): IRouteInfo {
    return {
      path: '/admin/page/get',
      method: EMethod.get
    }
  }

  async router (request: Request, response: Response, next: NextFunction) {
    let state = await this.pageMemento.getState()
    response.json({ state })
  }
}

@injectable()
export class PageSetAdminRoute extends AbstactAdminRoute {
  @inject(CType.Memento.Page)
  protected pageMemento!: PageMemento

  constructor () {
    super()
  }

  info (): IRouteInfo {
    return {
      path: '/admin/page/set',
      method: EMethod.post
    }
  }

  async router (request: Request, response: Response, next: NextFunction) {
    let state = request.body['state']
    await this.pageMemento.setState(state)
    response.json({ success: true })
  }
}
