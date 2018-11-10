import { inject, injectable } from 'inversify'
import { DbContainer } from './db'
import { CType, IInstallable, ISaveable } from '../declaration'
import { validate } from 'jsonschema'
import _ from 'lodash'
const filter = require('json-schema-filter')

@injectable()
export class KeyObjDbContainer implements IInstallable {
  private collectionName = 'KeyObjDb'

  constructor (
    @inject(CType.Db)
    private dbContainer: DbContainer
  ) {
  }

  async install (): Promise<void> {
    let db = await this.dbContainer.getDb()
    await db.createCollection<any>(this.collectionName)
    await db.collection(this.collectionName).createIndex({ 'key': 1 }, { unique: true })
    return
  }

  async uninstall (): Promise<void> {
    let db = await this.dbContainer.getDb()
    await db.dropCollection(this.collectionName)
  }

  async load<T> (key: string): Promise<T | null> {
    let db = await this.dbContainer.getDb()
    let row = await db.collection(this.collectionName).findOne({ key })
    if (row) return row['object']
    return null
  }

  async save (key: string, object: any): Promise<void> {
    let db = await this.dbContainer.getDb()
    await db.collection(this.collectionName).updateOne({ key }, { $set: { object } }, { upsert: true })
  }

}

@injectable()
export class BaseMemento<S> implements ISaveable {
  protected key: string = 'memento.base'
  protected state!: S
  protected defaultState!: S
  protected schema: any

  constructor (
    @inject(CType.KeyObjDb)
    protected keyObjDbContainer: KeyObjDbContainer
  ) {
  }

  async getState (force = false): Promise<S> {
    if (force || !this.state) {
      let state = await this.load()
      if (!state) {
        state = this.defaultState
      }
      this.state = state
    }

    return this.state
  }

  public setSchecma (schema: any) {
    this.schema = schema
  }

  public getDefaultSchema (): any | null {
    return null
  }

  public getSchema (): any | null {
    if (!this.schema) {
      this.setSchecma(this.getDefaultSchema())
    }

    return this.schema
  }

  async setState (state: S, toSave = true): Promise<void> {
    this.state = state
    let schema = this.getSchema()
    if (schema) {
      let results = validate(state, schema)
      if (!results.valid) {
        let messages = _.invokeMap(results.errors, 'toString').join('\n')
        throw new Error(messages)
      }
      this.state = filter(schema, this.state)
    }
    if (toSave) {
      await this.save()
    }
  }

  async load (): Promise<S | null> {
    return this.keyObjDbContainer.load<S>(this.key)
  }

  async save (): Promise<void> {
    await this.keyObjDbContainer.save(this.key, this.state)
  }

}
