import { inject, injectable } from 'inversify'
import { Db, MongoClient } from 'mongodb'
import { CType, IConfig } from '../declaration'

@injectable()
export class DbContainer {
  private db!: Db
  private client!: MongoClient

  constructor (
        @inject(CType.Config)
        private config: IConfig
    ) {
  }

  async getClient (): Promise<MongoClient> {
    if (this.client) {
      return new Promise<MongoClient>((resolve) => resolve(this.client))
    }

    let client = await MongoClient.connect(
            `mongodb://${this.config.db.host}:${this.config.db.port}`,
      {
        useNewUrlParser: true,
        bufferMaxEntries: 0
      }
        )
    return this.client = client
  }

  async getDb (): Promise<Db> {
    if (this.db) {
      return new Promise<Db>((resolve) => resolve(this.db))
    }

    let dbConf = this.config.db
    let client: MongoClient = await this.getClient()
    return this.db = client.db(dbConf.name)
  }

  async dispose (): Promise<void> {
    this.db = null
    return (await this.getClient()).close()
  }
}
