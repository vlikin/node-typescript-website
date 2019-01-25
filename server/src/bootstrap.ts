import 'reflect-metadata'
import { Container } from 'inversify'
import { ICommand } from './core/command'
import { CliContainer } from './container/cli'
import {
  ChangeAdminPasswordCommand,
  InstallCommand,
  ReinstallCommand,
  UninstallCommand
} from './command/index'
import { ClientConfigAdminRoute } from './route/admin/client-config'
import { GetTokenRoute } from './route/get-token'
import { TestRoute } from './route/test'
import { IRoute } from './core/route'
import { ServerContainer } from './container/server'
import { CType, IConfig } from './declaration'
import { DbContainer } from './container/db'
import { KeyObjDbContainer } from './container/key-obj-db'
import { DynamicConfigMemento } from './memento/dynamic-config'
import { CoreContainer } from './container/core'
import { ShellContainer } from './container/shell'
import { PostModel } from './model/post'
import { InitialDataCommand } from './command/initial-data'
import {
  PostCreateAdminRoute,
  PostDeleteAdminRoute,
  PostGetAdminRoute,
  PostListAdminRoute,
  PostSaveAdminRoute
} from './route/admin/post.g'
import { UploadFileAdminRoute } from './route/admin/upload-file'
import { InitialDataContainer } from './container/initial-data'
import { PageMemento } from './memento/page'
import { PageGetAdminRoute, PageSetAdminRoute } from './route/admin/page.g'
import { IndexRoute } from './route'
import { ResumeModel } from './model/resume'
import {
  ResumeCreateAdminRoute,
  ResumeDeleteAdminRoute, ResumeGetAdminRoute,
  ResumeListAdminRoute,
  ResumeSaveAdminRoute
} from './route/admin/resume.g'
import {InversifyExpressServer} from 'inversify-express-utils'
import {ServerV2Container} from './container/server-v2'
import {Application} from 'express'

// Server V2
import './controller/admin'

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
      configFile = 'default.js'
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
  let container: Container = bootstrapCore(config)

  container.bind<PageMemento>(CType.Memento.Page).to(PageMemento).inSingletonScope()
  container.bind<PostModel>(CType.Content.Post).to(PostModel).inSingletonScope()
  container.bind<ResumeModel>(CType.Content.Resume).to(ResumeModel).inSingletonScope()
  container.bind<ShellContainer>(CType.Shell).to(ShellContainer).inSingletonScope()
  container.bind<InitialDataContainer>(CType.InitialData).to(InitialDataContainer).inSingletonScope()

  return container
}

/**
 * Creates the start point of the application. The second layer.
 * It is used for Cli applications.
 */
export function bootstrapCli (config: IConfig): Container {
  let container: Container = bootstrapShell(config)
  container.bind<CliContainer>(CType.Cli).to(CliContainer).inSingletonScope()

  // Registers commands.
  container.bind<ICommand>(CType.ICommand).to(InstallCommand)
  container.bind<ICommand>(CType.ICommand).to(UninstallCommand)
  container.bind<ICommand>(CType.ICommand).to(ReinstallCommand)
  container.bind<ICommand>(CType.ICommand).to(ChangeAdminPasswordCommand)
  container.bind<ICommand>(CType.ICommand).to(InitialDataCommand)

  return container
}

/**
 * Creates the start point of the application. The second layer.
 * It is used for a web applications.
 */
export function bootstrapServer (config: IConfig): Container {
  let container: Container = bootstrapShell(config)
  container.bind<ServerContainer>(CType.Server).to(ServerContainer).inSingletonScope()

  // Registers routes.
  container.bind<IRoute>(CType.IRoute).to(IndexRoute)
  container.bind<IRoute>(CType.IRoute).to(TestRoute)
  container.bind<IRoute>(CType.IRoute).to(GetTokenRoute)

  // AdminService.
  container.bind<IRoute>(CType.IRoute).to(ClientConfigAdminRoute)

  container.bind<IRoute>(CType.IRoute).to(PostListAdminRoute)
  container.bind<IRoute>(CType.IRoute).to(PostCreateAdminRoute)
  container.bind<IRoute>(CType.IRoute).to(PostSaveAdminRoute)
  container.bind<IRoute>(CType.IRoute).to(PostGetAdminRoute)
  container.bind<IRoute>(CType.IRoute).to(PostDeleteAdminRoute)

  container.bind<IRoute>(CType.IRoute).to(ResumeListAdminRoute)
  container.bind<IRoute>(CType.IRoute).to(ResumeCreateAdminRoute)
  container.bind<IRoute>(CType.IRoute).to(ResumeSaveAdminRoute)
  container.bind<IRoute>(CType.IRoute).to(ResumeGetAdminRoute)
  container.bind<IRoute>(CType.IRoute).to(ResumeDeleteAdminRoute)

  container.bind<IRoute>(CType.IRoute).to(PageGetAdminRoute)
  container.bind<IRoute>(CType.IRoute).to(PageSetAdminRoute)

  container.bind<IRoute>(CType.IRoute).to(UploadFileAdminRoute)

  return container
}

export function bootstrapServerV2 (config: IConfig): Container {
  const container: Container = bootstrapShell(config)
  container.bind<ServerV2Container>(CType.Server).to(ServerV2Container).inSingletonScope()

  // create server
  const server = new InversifyExpressServer(container)
  const app = server.build()
  container.bind<Application>(CType.App).toConstantValue(app)

  return container
}
