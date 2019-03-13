import { bootstrapServerV2, resolveConfig } from '../../bootstrap'
import { CType, IConfig, ITokenData } from '../../declaration'
import { Application } from 'express'
import { ServerContainer } from '../../container/server'
import request from 'supertest'
import { ShellContainer } from '../../container/shell'
import { InitialDataContainer } from '../../container/initial-data'
import should from 'should'
import { CoreContainer } from '../../container/core'

describe('Controller Index', () => {
  const config: IConfig = resolveConfig()
  const container = bootstrapServerV2(config)
  const serverContainer = container.get<ServerContainer>(CType.Server)
  const app = container.get<Application>(CType.App)
  serverContainer.build()
  const shellContainer = container.get<ShellContainer>(CType.Shell)
  const initialDataContainer = container.get<InitialDataContainer>(CType.InitialData)
  const coreContainer = container.get<CoreContainer>(CType.Core)

  let rTokenData: ITokenData = {
    id: 'admin'
  }
  let rAuthToken = coreContainer.generateToken(rTokenData)
  let wTokenData: ITokenData = {
    id: 'wrong'
  }
  let wAuthToken = coreContainer.generateToken(wTokenData)

  before(async () => {
    await shellContainer.install()
    await initialDataContainer.migrate()
  })

  after(async () => {
    await shellContainer.uninstall()
    await shellContainer.dispose()
  })

  it('Index', async () => {
    const response = await request(app)
      .get('/')
      .expect(200)

    should(response.body.substr(0, 15)).equal('<!DOCTYPE html>')
  })

  describe('Token middleware.', () => {
    it('Wrong admin token', async () => {
      await request(app)
        .get('/v2/admin/page/get')
        .set('Authentication', `bearer ${wAuthToken}`)
        .expect(403)
    })

    it('Right admin token', async () => {
      let response = await request(app)
        .get('/v2/admin/page/get')
        .set('Authentication', `bearer ${rAuthToken}`)
        .expect(200)
    })
  })

})
