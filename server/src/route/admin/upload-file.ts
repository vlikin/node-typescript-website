import { injectable } from 'inversify'
import { AbstactAdminRoute, EMethod, IRouteInfo } from '../../core/route'
import path from 'path'
import uniqId from 'uniqid'
import { NextFunction, Request, Response } from 'express'
import { UploadedFile } from 'express-fileupload'

@injectable()
export class UploadFileAdminRoute extends AbstactAdminRoute {
  constructor () {
    super()
  }

  info (): IRouteInfo {
    return {
      path: '/admin/upload-file',
      method: EMethod.post
    }
  }

  router (request: Request, response: Response, next: NextFunction): any {
    let file = request.files!.document as UploadedFile
    let ext = path.extname(file!.name)
    let _uniqId = uniqId()
    let fileName = `${_uniqId}${ext}`
    file.mv(
      path.join(
        this.coreContainer.getFileStorageDir(),
        fileName
      ),
      (error) => {
        if (error) {
          return response.status(500).send(error)
        }
        response.json({ fileName })
      }
    )
  }
}
