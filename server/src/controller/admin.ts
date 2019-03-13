import { BaseHttpController, controller, httpGet, httpPost, isAuthenticated } from 'inversify-express-utils'
import { inject } from 'inversify'
import { CType, IConfig } from '../declaration'
import { PageMemento } from '../memento/page'
import { Request } from 'express'
import { IPostData, PostModel } from '../model/post'
import { ObjectID } from 'bson'
import { IResumeData, ResumeModel } from '../model/resume'
import { UploadedFile } from 'express-fileupload'
import path from 'path'
import uniqId from 'uniqid'
import { CoreContainer } from '../container/core'

@controller('/v2/admin')
export class AdminController extends BaseHttpController {
  @inject(CType.Config)
  private config: IConfig
  @inject(CType.Core)
  private coreContainer: CoreContainer
  @inject(CType.Memento.Page)
  private pageMemento: PageMemento
  @inject(CType.Content.Post)
  private postModel: PostModel
  @inject(CType.Content.Resume)
  private resumeModel: ResumeModel

  @httpGet('/client-config')
  private clientConfig () {
    return this.json({
      config: this.config.client
    }, 200)
  }

  @httpPost('/page/set')
  @isAuthenticated()
  private async pageSet (request: Request) {
    const state = request.body['state']
    await this.pageMemento.setState(state)

    return this.json({ success: true }, 200)
  }

  @httpGet('/page/get')
  @isAuthenticated()
  private async pageGet () {
    const state = await this.pageMemento.getState()

    return this.json({ state })
  }

  @httpGet('/post/list')
  @isAuthenticated()
  private async postList () {
    const list = await this.postModel.list()

    return this.json({ list })
  }

  @httpPost('/post/delete')
  @isAuthenticated()
  private async postDelete (request: Request) {
    const item = await this.postModel.delete(new ObjectID(request.body['_id']))

    return this.json({ item })
  }

  @httpPost('/post/get')
  @isAuthenticated()
  private async postGet (request: Request) {
    const item = await this.postModel.get(new ObjectID(request.body['_id']))

    return this.json({ item })
  }

  @httpPost('/post/create')
  @isAuthenticated()
  private async createSave (request: Request) {
    const item: IPostData = request.body['item']
    const _id = await this.postModel.create(item)

    return this.json({ _id: _id.toHexString() })
  }

  @httpPost('/post/save')
  @isAuthenticated()
  private async postSave (request: Request) {
    const item: IPostData = request.body['item']
    item._id = new ObjectID(item._id)
    await this.postModel.save(item)

    return this.json({ item })
  }

  @httpGet('/resume/list')
  @isAuthenticated()
  private async resumeList (request: Request) {
    let list = await this.resumeModel.list()

    return this.json({ list })
  }

  @httpPost('/resume/get')
  @isAuthenticated()
  private async resumeGet (request: Request) {
    const item = await this.resumeModel.get(new ObjectID(request.body['_id']))

    return this.json({ item })
  }

  @httpPost('/resume/delete')
  @isAuthenticated()
  private async resumeDelete (request: Request) {
    await this.resumeModel.delete(new ObjectID(request.body['_id']))

    return this.json({ success: true })
  }

  @httpPost('/resume/create')
  @isAuthenticated()
  private async resumeCreate (request: Request) {
    const item: IResumeData = request.body['item']
    const _id = await this.resumeModel.create(item)

    return this.json({ _id: _id.toHexString() })
  }

  @httpPost('/resume/save')
  @isAuthenticated()
  private async resumeSave (request: Request) {
    const item: IResumeData = request.body['item']
    item._id = new ObjectID(item._id)
    await this.resumeModel.save(item)

    return this.json({ item })
  }

  @httpPost('/upload-file')
  @isAuthenticated()
  private async uploadFile (request: Request) {
    const file = request['files'].document as UploadedFile
    const ext = path.extname(file!.name)
    const _uniqId = uniqId()
    const fileName = `${_uniqId}${ext}`

    return new Promise((resolve, reject) => {
      file.mv(
        path.join(
          this.coreContainer.getFileStorageDir(),
          fileName
        ),
          (error) => {
            if (error) {
              resolve(this.json(error, 500))
            }
            resolve(this.json({ fileName }))
          }
      )
    })
  }
}
