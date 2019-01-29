import should = require('should')
import {Request} from 'express'
import {bootstrapServerV2, resolveConfig} from '../../bootstrap'
import {AuthenticationContainer, UserPrincipal} from '../../container/authentication'
import {CType, ITokenData} from '../../declaration'
import {CoreContainer} from '../../container/core'

describe('Authentication Container', () => {
  const config = resolveConfig()
  const container = bootstrapServerV2(config)
  const coreContainer = container.get<CoreContainer>(CType.Core)
  const authenticationContainer = container.get<AuthenticationContainer>(CType.Authentication)
  const tokenData: ITokenData = {
    id: 'admin'
  }
  const authToken = coreContainer.generateToken(tokenData)

  describe('Principal', () => {
    it('isAuthenticated', async () => {
      const emptyUserData = {}
      let principal = new UserPrincipal(emptyUserData)
      should(await principal.isAuthenticated()).equal(false)
      const userData = {
        id: 'admin'
      }
      principal = new UserPrincipal(userData)
      should(await principal.isAuthenticated()).equal(true)
    })
  })

  describe('Container Authentication', () => {
    it('isAuthenticated', async () => {
      // Fail.
      const emptyRequest = {
        get (key) {
          return ``
        }
      } as Request
      let principal = await authenticationContainer.getUser(emptyRequest, null, null)
      should(await principal.isAuthenticated()).equal(false)

      // Succcess.
      const authenticatedRequest = {
        get (key) {
          return `bearer ${authToken}`
        }
      } as Request
      principal = await authenticationContainer.getUser(authenticatedRequest, null, null)
      should(await principal.isAuthenticated()).equal(true)

    })
  })

})
