import { bootstrapShell, resolveConfig } from '../../bootstrap'
import { CType } from '../../declaration'
import should = require('should')
import { ShellContainer } from '../../container/shell'

describe('Shell Container', () => {
  const config = resolveConfig()
  const container = bootstrapShell(config)
  const shellContainer = container.get<ShellContainer>(CType.Shell)

  before(async () => {
    return shellContainer.install()
  })

  it('Shell', () => {
    let test = shellContainer.test()
    should(test).equal('ShellContainer-test')
  })

  after(async () => {
    await shellContainer.uninstall()
    return shellContainer.dispose()
  })
})
