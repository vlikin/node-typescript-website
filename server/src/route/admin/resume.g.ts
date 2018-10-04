import {inject, injectable} from "inversify";
import {AbstactAdminRoute, EMethod, IRouteInfo} from "../../core/route";
import {NextFunction, Request, Response} from "express";
import {IResumeData, ResumeModel} from "../../model/resume";
import {CType} from "../../declaration";
import {schemaRules} from '../../validator';
import {ObjectID} from "mongodb";

@injectable()
export class ResumeListAdminRoute extends AbstactAdminRoute {
  @inject(CType.Content.Resume)
  protected resumeModel!: ResumeModel;

  constructor() {
    super();
  }

  info(): IRouteInfo {
    return {
      path: '/admin/resume/list',
      method: EMethod.get
    }
  }

  async router(request: Request, response: Response, next: NextFunction) {
    let list = await this.resumeModel.list();
    response.json({list});
  }
}

@injectable()
export class ResumeGetAdminRoute extends AbstactAdminRoute {
  @inject(CType.Content.Resume)
  protected resumeModel!: ResumeModel;

  constructor() {
    super();
  }

  info(): IRouteInfo {
    return {
      path: '/admin/resume/get',
      method: EMethod.post,
      schema: {
        type: 'object',
        properties: {
          _id: schemaRules.mongoId
        }
      }
    }
  }

  async router(request: Request, response: Response, next: NextFunction) {
    let item = await this.resumeModel.get(new ObjectID(request.body['_id']));
    response.json({item});
  }
}

@injectable()
export class ResumeDeleteAdminRoute extends AbstactAdminRoute {
  @inject(CType.Content.Resume)
  protected resumeModel!: ResumeModel;

  constructor() {
    super();
  }

  info(): IRouteInfo {
    return {
      path: '/admin/resume/delete',
      method: EMethod.post,
      schema: {
        type: 'object',
        properties: {
          _id: schemaRules.mongoId
        }
      }
    }
  }

  async router(request: Request, response: Response, next: NextFunction) {
    await this.resumeModel.delete(new ObjectID(request.body['_id']));
    response
      .status(200)
      .json({success: true})
  }
}

@injectable()
export class ResumeCreateAdminRoute extends AbstactAdminRoute {
  @inject(CType.Content.Resume)
  protected resumeModel!: ResumeModel;

  constructor() {
    super();
  }

  info(): IRouteInfo {
    return {
      path: '/admin/resume/create',
      method: EMethod.post
    }
  }

  async router(request: Request, response: Response, next: NextFunction) {
    let item: IResumeData = request.body['item'];
    let _id = await this.resumeModel.create(item);
    response.json({_id: _id.toHexString()});
  }
}

@injectable()
export class ResumeSaveAdminRoute extends AbstactAdminRoute {
  @inject(CType.Content.Resume)
  protected resumeModel!: ResumeModel;

  constructor() {
    super();
  }

  info(): IRouteInfo {
    return {
      path: '/admin/resume/save',
      method: EMethod.post
    }
  }

  async router(request: Request, response: Response, next: NextFunction) {
    let item: IResumeData = request.body['item'];
    item._id = new ObjectID(item._id);
    await this.resumeModel.save(item);
    response.json({item});
  }
}
