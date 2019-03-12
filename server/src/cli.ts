import 'reflect-metadata'
import { build, registerGroups } from 'inversify-commander-utils'
import program from 'commander'
import { bootstrapShell, resolveConfig } from './bootstrap'

// Register commander containers.
import './cli/index'

const config = resolveConfig()
const container = bootstrapShell(config)

registerGroups(container)
build(program, container)

if (require.main === module) {
  program
    .parse(process.argv)
}
