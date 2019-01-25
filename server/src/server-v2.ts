import { Container } from 'inversify'
import { bootstrapServerV2, resolveConfig } from './bootstrap'
import { ServerContainer } from './container/server'
import { CType } from './declaration'

let config = resolveConfig()
let container: Container = bootstrapServerV2(config)
let serverContainer = container.get<ServerContainer>(CType.Server)
serverContainer.build()
serverContainer.listen()
