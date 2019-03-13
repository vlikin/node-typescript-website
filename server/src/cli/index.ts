import { action, group } from 'inversify-commander-utils'
import { inject } from 'inversify'
import { CType } from '../declaration'
import { ShellContainer } from '../container/shell'
import 'colors'
import inquirer from 'inquirer'
import { DynamicConfigMemento } from '../memento/dynamic-config'
import { InitialDataContainer } from '../container/initial-data'

@group('cli')
export class IndexGroup {

  @inject(CType.Shell)
  private shellContainer: ShellContainer
  @inject(CType.Memento.DynamicConfig)
  private dynamicConfigMemento: DynamicConfigMemento
  @inject(CType.InitialData)
  private initialDataContainer: InitialDataContainer

  @action('install')
  public async install (command: any, options: any = {}) {
    await this.shellContainer.install()
    console.log('The application has been installed successfully.'.green)
    if (!options.noDispose) {
      await this.shellContainer.dispose()
    }
  }

  @action('uninstall')
    public async uninstall (command: any, options: any = {}) {
    console.log('You are going to uninstall the application! It can destroy some data.'.red)
    let proceed = true
    if (!options.y) {
      const questions = [
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Do you want to continue the application un-installation?',
          default: false
        }
      ]
      let { proceed } = await inquirer.prompt<{ proceed: boolean }>(questions)
    }
    if (proceed) {
      await this.shellContainer.uninstall()
      console.log('The application has been uninstalled successfully.'.green)
    }
    if (!options.noDispose) {
      await this.shellContainer.dispose()
    }
  }

  @action('reinstall')
  public async reinstall (command: any, options: any = {}) {
    console.log('You are going to reinstall the application! It can destroy some data.'.red)
    let proceed = true
    if (!options.y) {
      const questions = [
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Do you want to continue the application re-installation?',
          default: false
        }
      ]
      let { proceed } = await inquirer.prompt<{ proceed: boolean }>(questions)
    }
    if (proceed) {
      await this.shellContainer.uninstall()
      await this.shellContainer.install()
      console.log('The application has been reinstalled successfully.'.green)
    }
    if (!options.noDispose) {
      await this.shellContainer.dispose()
    }
  }

  @action(
    'admin-password',
    null,
    'Resets the admin password.'
  )
  public async adminPassword (command: any, options: any = {}) {
    let password
    if (!options.password) {
      const questions = [
        {
          type: 'password',
          message: 'Enter new admin password',
          name: 'password',
          mask: '*'
        }
      ]
      let { password } = await inquirer.prompt<{ password: string }>(questions)
    } else {
      password = options.password
    }
    let state = await this.dynamicConfigMemento.getState()
    state.adminPassword = password
    await this.dynamicConfigMemento.setState(state)
    console.log('AdminService password has been changed!'.green)
    if (!options.noDispose) {
      await this.shellContainer.dispose()
    }
  }

  @action('initial-data', null, 'Sets initial data.')
  public async initialData (command: any, options: any = {}) {
    await this.initialDataContainer.migrate('.')
    console.log('Initial data have been migrated!'.green)
    if (!options.noDispose) {
      await this.shellContainer.dispose()
    }
  }
}
