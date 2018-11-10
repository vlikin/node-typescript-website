import { bootstrapCore, resolveConfig } from '../../bootstrap'
import { DbContainer } from '../../container/db'
import { CType } from '../../declaration'
import { Db } from 'mongodb'

describe('Db container', () => {
  const config = resolveConfig()
  const container = bootstrapCore(config)
  const dbContainer = container.get<DbContainer>(CType.Db)

  it('Db', async () => {
    await dbContainer.getDb()
    return dbContainer.dispose()
  })
})
