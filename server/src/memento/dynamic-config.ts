import { inject, injectable } from 'inversify'
import { BaseMemento, KeyObjDbContainer } from '../container/key-obj-db'
import { CType, IDynamicConfig } from '../declaration'

@injectable()
export class DynamicConfigMemento extends BaseMemento<IDynamicConfig> {
  constructor (
        @inject(CType.KeyObjDb)
        protected keyObjDbContainer: KeyObjDbContainer
    ) {
    super(keyObjDbContainer)
    this.key = 'memento.dynamic-config'
    this.defaultState = {
      adminPassword: 'admin'
    }
  }
}
