import { inject, injectable } from 'inversify'
import { Request, Response, NextFunction } from 'express'
import { interfaces } from 'inversify-express-utils'
import AuthProvider = interfaces.AuthProvider
import Principal = interfaces.Principal
import { CoreContainer } from './core'
import {CType} from '../declaration'

export interface IUserData {
  id?: string
}

export class UserPrincipal implements interfaces.Principal {
  public details: IUserData
  public constructor (details: any) {
    this.details = details
  }

  public isAuthenticated (): Promise<boolean> {
    return Promise.resolve(!!this.details && !!this.details.id)
  }

  public async isResourceOwner (resourceId: any): Promise<boolean> {
    // Is not used.
    return Promise.resolve(false)
  }

  public isInRole (role: string): Promise<boolean> {
    // Is not used.
    return Promise.resolve(false)
  }

}

@injectable()
export class AuthenticationContainer implements AuthProvider {

  @inject(CType.Core)
  private coreContainer!: CoreContainer

  public async getUser (
    request: Request,
    response: Response,
    next?: NextFunction
  ): Promise<Principal> {
    let authorizationStr = request.get('Authentication')
    if (authorizationStr) {
      let type = authorizationStr.substr(0, 6)
      if (type === 'bearer') {
        let encryptedToken = authorizationStr.substr(7)
        let data = this.coreContainer.decodeToken(encryptedToken)
        if (data.id === 'admin') {
          // Authenticated.
          return new UserPrincipal(data)
        } else {
          throw new Error('The token data has the wrong structure.');
        }
      }
    } else {
      // Anonymouse.
      return new UserPrincipal({})
    }
  }

}
