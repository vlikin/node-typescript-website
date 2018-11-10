import { bootstrapCore, resolveConfig } from '../../bootstrap'
import { DbContainer } from '../../container/db'
import { CType, IDynamicConfig } from '../../declaration'
import { KeyObjDbContainer } from '../../container/key-obj-db'
import should = require('should')
import { DynamicConfigMemento } from '../../memento/dynamic-config'

describe('Dynamic Config Memento container', () => {
  const config = resolveConfig()
  const container = bootstrapCore(config)
  const dbContainer = container.get<DbContainer>(CType.Db)
  const keyObjDbContainer = container.get<KeyObjDbContainer>(CType.KeyObjDb)
  const dynamicConfigMemento = container.get<DynamicConfigMemento>(CType.Memento.DynamicConfig)

  before(async () => {
    return keyObjDbContainer.install()
  })

  it('Default value', async () => {
    let state = await dynamicConfigMemento.getState()
    should(config.dynamicConfig.adminPassword).equal(state.adminPassword)
  })

  it('Get/Set state', async () => {
    let changedAdminPassword = 'changedAdminPassword'
    let state: IDynamicConfig = {
      adminPassword: changedAdminPassword
    }
    await dynamicConfigMemento.setState(state)
    let changedState = await dynamicConfigMemento.getState()
    should(changedState.adminPassword).equal(state.adminPassword)
  })

  after(async () => {
    await keyObjDbContainer.uninstall()
    await dbContainer.dispose()
  })
})
