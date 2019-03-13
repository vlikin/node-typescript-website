import 'reflect-metadata'
import express, { Application } from 'express'
import { Container } from 'inversify'
import { CType, IConfig } from './declaration'
import { DbContainer } from './container/db'
import { KeyObjDbContainer } from './container/key-obj-db'
import { DynamicConfigMemento } from './memento/dynamic-config'
import { CoreContainer } from './container/core'
import { ShellContainer } from './container/shell'
import { PostModel } from './model/post'
import { InitialDataContainer } from './container/initial-data'
import { PageMemento } from './memento/page'
import { ResumeModel } from './model/resume'
import { InversifyExpressServer } from 'inversify-express-utils'
import { ServerContainer } from './container/server'

// Server controller registration.
import './controller/index'
import './controller/admin'

import { AuthenticationContainer } from './container/authentication'

declare var process: {
  env: {
    configFile: string
  }
}

export function resolveConfig (configFile: string | null = null): IConfig {
  if (!configFile) {
    if (process.env.configFile) {
      configFile = process.env.configFile
    } else {
      configFile = '../config/default.js'
    }
  }

  return require(configFile)
}

/**
 * Creates the start point of the application. The first step on the first layer.
 */
export function bootstrapCore (config: IConfig): Container {
  let container: Container = new Container()
  container.bind<IConfig>(CType.Config).toConstantValue(config)
  container.bind<CoreContainer>(CType.Core).to(CoreContainer).inSingletonScope()
  container.bind<DbContainer>(CType.Db).to(DbContainer).inSingletonScope()
  container.bind<KeyObjDbContainer>(CType.KeyObjDb).to(KeyObjDbContainer).inSingletonScope()
  container.bind<DynamicConfigMemento>(CType.Memento.DynamicConfig).to(DynamicConfigMemento).inSingletonScope()

  return container
}

/**
 * Creates the top library layer. The application layers are based on.
 */
export function bootstrapShell (config: IConfig): Container {
  const container = bootstrapCore(config)

  container.bind<PageMemento>(CType.Memento.Page).to(PageMemento).inSingletonScope()
  container.bind<PostModel>(CType.Content.Post).to(PostModel).inSingletonScope()
  container.bind<ResumeModel>(CType.Content.Resume).to(ResumeModel).inSingletonScope()
  container.bind<ShellContainer>(CType.Shell).to(ShellContainer).inSingletonScope()
  container.bind<InitialDataContainer>(CType.InitialData).to(InitialDataContainer).inSingletonScope()

  return container
}

export function bootstrapServerV2 (config: IConfig): Container {
  const container = bootstrapShell(config)
  container.bind<AuthenticationContainer>(CType.Authentication).to(AuthenticationContainer).inSingletonScope()
  container.bind<ServerContainer>(CType.Server).to(ServerContainer).inSingletonScope()

  // create server
  const app = express()
  container.bind<Application>(CType.App).toConstantValue(app)
  const serverContainer = container.get<ServerContainer>(CType.Server)
  serverContainer.build()
  const server = new InversifyExpressServer(container, null, null, app, AuthenticationContainer)
  server.build()

  return container
}
