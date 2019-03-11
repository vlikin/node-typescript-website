import { action, group } from 'inversify-commander-utils'
import { inject } from 'inversify'
import { CType } from '../declaration'
import { ShellContainer } from '../container/shell'
import 'colors'
import inquirer from 'inquirer'

@group('cli')
export class IndexGroup {

  @inject(CType.Shell)
    private shellContainer: ShellContainer

    // @inject(TodoContainer)
    // public todoContainer!: TodoContainer;

  @action(
        'A <parameter>',
    [
            { pattern: '-c, --count <mode>', description: 'Number of prints.' }
    ]
    )
    public testA (parameter: string, command: any) {
        // console.log(this.todoContainer.printPaper());
    console.log(parameter, command.count)
  }

  @action('install')
  public async install (parameter: string, command: any) {
    await this.shellContainer.install()
    // await this.shellContainer.dispose()
    console.log('The application has been installed successfully.'.green)
  }

  @action('uninstall')
    public async uninstall (parameter: string, command: any, options: any) {
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
  }

  @action('reinstall')
  public async reinstall (parameter: string, command: any, options: any) {
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
  }
}
