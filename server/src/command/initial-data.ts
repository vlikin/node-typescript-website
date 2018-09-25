import {inject, injectable} from 'inversify';
import {AbstractCommand} from '../core/command';
import {CType} from '../declaration';
import {ShellContainer} from '../container/shell';
import 'colors';
import {InitialDataContainer} from "../container/initial-data";

@injectable()
export class InitialDataCommand extends AbstractCommand {
  @inject(CType.Shell)
  private shellContainer!: ShellContainer;
  @inject(CType.InitialData)
  private initialDataContainer!: InitialDataContainer;

  info() {
    return {
      command: 'initial-data',
      description: 'Sets initial data.',
      options: []
    }
  }

  async command(env: any, options: any): Promise<void> {
    await this.initialDataContainer.migrate('.');
    await this.shellContainer.dispose();
    console.log('Posts have been migrated!'.red);
  }
}
