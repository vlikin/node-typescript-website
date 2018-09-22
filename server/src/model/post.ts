import {inject, injectable} from "inversify";
import {CType, IConfig, IInstallable} from "../declaration";
import {DbContainer} from "../container/db";
import {ObjectID} from "bson";
import {DeleteWriteOpResultObject, UpdateWriteOpResult} from "mongodb";
import * as _ from 'lodash';
import {validator, schemaRules} from '../validator';




export interface IPostData {
  _id?: ObjectID;
  link: string;
  date: Date
  translations: {
    [key: string]: {
      title: string
    }
  }
}

export const PostDataSchema = {
  type: 'object',
  definitions: {
    translation: {
      type: 'object',
      properties: {
        title: schemaRules.simpleString
      },
      required: ['title']
    }
  },
  properties: {
    _id: schemaRules.mongoId,
    link: schemaRules.simpleString,
    date: {
      type: 'dateObject',
    },
    translations: {
      additionalProperties: {
        $ref: '#/definitions/translation',
      },
      type: 'object'
    }
  },
  required: ['link', 'date']
};

@injectable()
export class PostModel implements IInstallable {
  private collectionName = 'post';

  @inject(CType.Config)
  protected config!: IConfig;
  @inject(CType.Db)
  protected dbContainer!: DbContainer;

  public async create(post: IPostData): Promise<ObjectID> {
    let res = validator.validate(post, PostDataSchema);
    if (!res.valid) throw new Error(_.invokeMap(res.errors, 'toString').join(' '));
    let db = await this.dbContainer.getDb();
    let result = await db.collection(this.collectionName).insertOne(post);

    return result.insertedId;
  }

  public async get(_id: ObjectID): Promise<IPostData> {
    let db = await this.dbContainer.getDb();
    return await db.collection(this.collectionName).findOne({_id});
  }

  public async delete(_id: ObjectID): Promise<DeleteWriteOpResultObject> {
    let db = await this.dbContainer.getDb();
    return await db.collection(this.collectionName).deleteOne({_id});
  }

  public async save(post: IPostData): Promise<UpdateWriteOpResult> {
    let db = await this.dbContainer.getDb();
    return await db.collection(this.collectionName).updateOne({_id: post._id}, {$set: post});
  }

  public async list(): Promise<IPostData[]> {
    let db = await this.dbContainer.getDb();
    return await db.collection(this.collectionName).aggregate([
      {
        $sort: {date: -1}
      }
    ]).toArray();
  }

  async install(): Promise<void> {
    let db = await this.dbContainer.getDb();
    let properties = _.fromPairs(this.config.languages.map((language) => {
      return [language, {$ref: '#/definitions/post'}]
    }));
    await db.createCollection(
      this.collectionName,
      {
        // validator: {
        //     $jsonSchema: {
        //         bsonType: 'object',
        //         required: ['title', 'summary', 'link'],
        //         definitions: {
        //             post: {
        //                 title: {
        //                     bsonType: 'string',
        //                     description: 'Title is required'
        //                 },
        //                 summary: {
        //                     bsonType: 'string',
        //                     description: 'Summary is required'
        //                 },
        //                 href: {
        //                     bsonType: 'string',
        //                     description: 'Summary is required'
        //                 },
        //             },
        //         },
        //         properties,
        //     }
        // }
      }
    );
  }

  async uninstall(): Promise<void> {
    let db = await this.dbContainer.getDb();
    await db.dropCollection(this.collectionName);
  }
}