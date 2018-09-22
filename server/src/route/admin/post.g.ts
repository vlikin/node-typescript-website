import {inject, injectable} from "inversify";
import {AbstactAdminRoute, EMethod, IRouteInfo} from "../../core/route";
import {NextFunction, Request, Response} from "express";
import {IPostData, PostModel} from "../../model/post";
import {CType} from "../../declaration";
import {schemaRules} from '../../validator';
import {ObjectID} from "mongodb";

@injectable()
export class PostListAdminRoute extends AbstactAdminRoute {
  @inject(CType.Content.Post)
  protected postModel!: PostModel;

  constructor() {
    super();
  }

  info(): IRouteInfo {
    return {
      path: '/admin/post/list',
      method: EMethod.get
    }
  }

  async router(request: Request, response: Response, next: NextFunction) {
    let list = await this.postModel.list();
    response.json({list});
  }
}

@injectable()
export class PostGetAdminRoute extends AbstactAdminRoute {
  @inject(CType.Content.Post)
  protected postModel!: PostModel;

  constructor() {
    super();
  }

  info(): IRouteInfo {
    return {
      path: '/admin/post/get',
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
    let item = await this.postModel.get(new ObjectID(request.body['_id']));
    response.json({item});
  }
}

@injectable()
export class PostDeleteAdminRoute extends AbstactAdminRoute {
  @inject(CType.Content.Post)
  protected postModel!: PostModel;

  constructor() {
    super();
  }

  info(): IRouteInfo {
    return {
      path: '/admin/post/delete',
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
    await this.postModel.delete(new ObjectID(request.body['_id']));
    response
      .status(200)
      .json({success: true})
  }
}

@injectable()
export class PostCreateAdminRoute extends AbstactAdminRoute {
  @inject(CType.Content.Post)
  protected postModel!: PostModel;

  constructor() {
    super();
  }

  info(): IRouteInfo {
    return {
      path: '/admin/post/create',
      method: EMethod.post
    }
  }

  async router(request: Request, response: Response, next: NextFunction) {
    let item: IPostData = request.body['item'];
    let _id = await this.postModel.create(item);
    response.json({_id: _id.toHexString()});
  }
}

@injectable()
export class PostSaveAdminRoute extends AbstactAdminRoute {
  @inject(CType.Content.Post)
  protected postModel!: PostModel;

  constructor() {
    super();
  }

  info(): IRouteInfo {
    return {
      path: '/admin/post/save',
      method: EMethod.post
    }
  }

  async router(request: Request, response: Response, next: NextFunction) {
    let item: IPostData = request.body['item'];
    item._id = new ObjectID(item._id);
    await this.postModel.save(item);
    response.json({item});
  }
}
