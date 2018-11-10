import { injectable } from 'inversify'
import { Command as CCommand } from 'commander'

export interface ICommandInfo {
  command: string,
  description: string,
  options?: string[]
}

export interface ICommand {
  info (): ICommandInfo
  build (commander: any): void
  command (env: any, options: any): void
}

@injectable()
export abstract class AbstractCommand implements ICommand {
  build (commander: any): void {
    let info: ICommandInfo = this.info()
    let command: CCommand = commander
            .command(info.command)
            .description(info.description)
            .action((env: any, options: any) => this.command(env, options))
    if (info.options) {
      info.options.forEach((option) => {
        command.option(option)
      })
    }
  }

  abstract command (env: any, options: any): void
  abstract info (): ICommandInfo
}
