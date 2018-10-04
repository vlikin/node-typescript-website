import {inject, injectable} from "inversify";
import {CType, IConfig, IInstallable} from "../declaration";
import {DbContainer} from "../container/db";
import {ObjectID} from "bson";
import {DeleteWriteOpResultObject, UpdateWriteOpResult} from "mongodb";
import * as _ from 'lodash';
import {validator, schemaRules} from '../validator';


export interface IResumeData {
  _id?: ObjectID;
  translations: {
    [key: string]: {
      position: string
      company: string
      place: string
      period: string
      description: string
    }
  }
}

export const ResumeDataSchema = {
  type: 'object',
  definitions: {
    translation: {
      type: 'object',
      properties: {
        position: schemaRules.simpleString,
        company: schemaRules.simpleString,
        place: schemaRules.simpleString,
        period: schemaRules.simpleString,
        description: schemaRules.simpleString
      },
      required: ['position']
    }
  },
  properties: {
    _id: schemaRules.mongoId,
    translations: {
      additionalProperties: {
        $ref: '#/definitions/translation',
      },
      type: 'object'
    }
  },
  required: []
};

@injectable()
export class ResumeModel implements IInstallable {
  private collectionName = 'resume';

  @inject(CType.Config)
  protected config!: IConfig;
  @inject(CType.Db)
  protected dbContainer!: DbContainer;

  public async create(resume: IResumeData): Promise<ObjectID> {
    let res = validator.validate(resume, ResumeDataSchema);
    if (!res.valid) throw new Error(_.invokeMap(res.errors, 'toString').join(' '));
    let db = await this.dbContainer.getDb();
    let result = await db.collection(this.collectionName).insertOne(resume);

    return result.insertedId;
  }

  public async get(_id: ObjectID): Promise<IResumeData> {
    let db = await this.dbContainer.getDb();
    return await db.collection(this.collectionName).findOne({_id});
  }

  public async delete(_id: ObjectID): Promise<DeleteWriteOpResultObject> {
    let db = await this.dbContainer.getDb();
    return await db.collection(this.collectionName).deleteOne({_id});
  }

  public async save(post: IResumeData): Promise<UpdateWriteOpResult> {
    let db = await this.dbContainer.getDb();
    return await db.collection(this.collectionName).updateOne({_id: post._id}, {$set: post});
  }

  public async list(): Promise<IResumeData[]> {
    let db = await this.dbContainer.getDb();
    return await db.collection(this.collectionName).aggregate([
      {
        $sort: {date: -1}
      }
    ]).toArray();
  }

  async install(): Promise<void> {
    let db = await this.dbContainer.getDb();
    await db.createCollection(this.collectionName);
  }

  async uninstall(): Promise<void> {
    let db = await this.dbContainer.getDb();
    await db.dropCollection(this.collectionName);
  }
}
