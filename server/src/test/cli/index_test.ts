import { bootstrapShell, resolveConfig } from '../../bootstrap'
import { ShellContainer } from '../../container/shell'
import { CType } from '../../declaration'
import { registerGroups, TYPE as CliType } from 'inversify-commander-utils'
import '../../cli/index'
import { IndexGroup } from '../../cli/index'
import colors from 'colors'
import should from 'should'

colors.enabled = false

describe('CLI commands', () => {
  const config = resolveConfig()
  const container = bootstrapShell(config)
  const shellContainer = container.get<ShellContainer>(CType.Shell)
  let standartConsole = null
  let logs = []
  registerGroups(container)
  /**
   * @todo resolve later.
   * We can not test the logic through commander because
   * it does not support asynchronize execution. We are
   * not able to chain it. So tests will be brocken.
   */
  // build(program, container)
  const indexCliContainer: IndexGroup = container.getNamed(CliType.Group, 'IndexGroup')

  before(async () => {
    await shellContainer.install()
  })

  beforeEach(() => {
    logs = []
    standartConsole = console.log
    console.log = function () {
      logs.push(arguments)
    }
  })

  afterEach(() => {
    logs = []
    console.log = standartConsole
  })

  it('Install/Uninstall/Reinstall', async () => {
    await indexCliContainer.uninstall(null, { y: true, noDispose: true })
    should(logs.pop()[0]).equal('The application has been uninstalled successfully.')
    should(logs.pop()[0]).equal('You are going to uninstall the application! It can destroy some data.')
    await shellContainer.install()
    await indexCliContainer.reinstall(null, { y: true, noDispose: true })
    should(logs.pop()[0]).equal('The application has been reinstalled successfully.')
    should(logs.pop()[0]).equal('You are going to reinstall the application! It can destroy some data.')
  })

  it('Admin password', async () => {
    await indexCliContainer.adminPassword(
      null,
      {
        y: true,
        noDispose: true,
        password: 'new-password'
      }
    )
    should(logs.pop()[0]).equal('AdminService password has been changed!')
  })

  it('Initial data', async () => {
    await indexCliContainer.initialData(null, { y: true, noDispose: true })
    should(logs.pop()[0]).equal('Initial data have been migrated!')
  })

  after(async () => {
    await shellContainer.uninstall()
    await shellContainer.dispose()
  })
})
