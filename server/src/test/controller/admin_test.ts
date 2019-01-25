import should = require('should')
import request from 'supertest'
import {CType, IConfig, ITokenData} from '../../declaration'
import {bootstrapServerV2, resolveConfig} from '../../bootstrap'
import {Application} from 'express'
import {ServerV2Container} from '../../container/server-v2'
import {CoreContainer} from '../../container/core'
import {ShellContainer} from '../../container/shell'
import {InitialDataContainer} from '../../container/initial-data'

describe('Controller Admin', () => {
  const config: IConfig = resolveConfig()
  const container = bootstrapServerV2(config)
  const coreContainer = container.get<CoreContainer>(CType.Core)
  const shellContainer = container.get<ShellContainer>(CType.Shell)
  const initialDataContainer = container.get<InitialDataContainer>(CType.InitialData)
  const serverContainer = container.get<ServerV2Container>(CType.Server)
  const app = container.get<Application>(CType.App)
  serverContainer.build()
  const tokenData: ITokenData = {
    id: 'admin'
  }
  const authToken = coreContainer.generateToken(tokenData)
  let state: any

  before(async () => {
    await shellContainer.install()
    await initialDataContainer.migrate('.')
  })

  after(async () => {
    await shellContainer.uninstall()
    await shellContainer.dispose()
  })

  it('Client Config', async () => {
    const response = await request(app)
      .get('/v2/admin/client-config')
      .expect(200)
    should(response.body.config.defaultLanguage).equal('en')
  })

  describe('Page', () => {
    it('Get', async () => {
      let response = await request(app)
        .get('/v2/admin/page/get')
        .set('Authentication', `bearer ${authToken}`)
        .expect(200)
      state = response.body.state
      should(state.section).not.null()
    })

    it('Set', async () => {
      let value = 'Value has been changed'
      state.component.header.translations.en.menu.home = value
      await request(app)
        .post('/v2/admin/page/set')
        .send({ state })
        .set('Authentication', `bearer ${authToken}`)
        .expect(200)

      let response = await request(app)
        .get('/v2/admin/page/get')
        .set('Authentication', `bearer ${authToken}`)
        .expect(200)
      state = response.body.state
      should(state.component.header.translations.en.menu.home).equal(value)
    })
  })
})
