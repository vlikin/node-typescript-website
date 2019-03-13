import { BaseHttpController, controller, httpGet } from 'inversify-express-utils'
import { Request } from 'express'
import _ from 'lodash'
import pug from 'pug'
import * as path from 'path'
import { inject } from 'inversify'
import { CType, IConfig, IDynamicConfig, ITokenData } from '../declaration'
import { PageMemento } from '../memento/page'
import { PostModel } from '../model/post'
import { ResumeModel } from '../model/resume'
import { DynamicConfigMemento } from '../memento/dynamic-config'
import { CoreContainer } from '../container/core'

@controller('/')
export class IndexController extends BaseHttpController {

  @inject(CType.Config)
  private config!: IConfig
  @inject(CType.Memento.Page)
  private pageMemento!: PageMemento
  @inject(CType.Content.Post)
  private postModel!: PostModel
  @inject(CType.Content.Resume)
  private resumeModel!: ResumeModel
  @inject(CType.Memento.DynamicConfig)
  private dynamicConfigMemento!: DynamicConfigMemento
  @inject(CType.Core)
  private coreContainer!: CoreContainer

  @httpGet('/')
  private async indexAction (request: Request) {
    let state: any = await this.pageMemento.getState()
    let posts = await this.postModel.list()
    state.section.blog.articles = posts
    let resumes = await this.resumeModel.list()
    state.section.resume.position = resumes
    let options = {}
    let locals = {
      lng: request.params.lang || 'en'
    }

    let vars = _.merge(options, locals, state)
    let html = pug.renderFile(path.resolve('./pug/index.pug'), vars)

    return this.ok(html)
  }

  @httpGet('/getToken')
  private async getTokenAction (request: Request) {
    let password = request.body['password']
    let state: IDynamicConfig = await this.dynamicConfigMemento.getState()
    if (state.adminPassword === password) {
      let tokenData: ITokenData = {
        id: 'admin'
      }
      let token = this.coreContainer.generateToken(tokenData)
      return this.json({ token })
    } else {
      return this.json({ message: 'Wrong authentication data.' }, 202)
    }
  }
}
