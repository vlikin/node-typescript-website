import 'mocha'
import { bootstrapCli, resolveConfig } from '../../bootstrap'
import { CliContainer } from '../../container/cli'
import { Container } from 'inversify'
import should = require('should')
import { ICommand } from '../../core/command'
import { CType } from '../../declaration'

describe('Cli container', () => {
  const config = resolveConfig()
  const container: Container = bootstrapCli(config)
  const cliContainer = container.get<CliContainer>(CType.Cli)

  it('Checks registered commands', () => {
    let commandsFromLocator = container.getAll<ICommand>(CType.ICommand)
    let commandsFromContainer = cliContainer.getCommands()
    should(commandsFromLocator.length).above(0)
    should(commandsFromLocator.length).equal(commandsFromContainer.length)
  })
})
