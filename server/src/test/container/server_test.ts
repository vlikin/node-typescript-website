import 'mocha'
import request from 'supertest'
import { bootstrapServerV2, resolveConfig } from '../../bootstrap'
import should = require('should')
import { CType } from '../../declaration'
import { ServerContainer } from '../../container/server'
import { Application } from 'express'

describe('Server container', () => {
  const config = resolveConfig()
  const container = bootstrapServerV2(config)
  const app = container.get<Application>(CType.App)
  const serverContainer = container.get<ServerContainer>(CType.Server)
  serverContainer.build()

  before(() => {
    serverContainer.build()
  })

  it('Static files', async () => {
    should(true).equal(true)
    await request(app)
      .get('/static/image.jpg')
      .expect(200)
  })
})
