import {inject, injectable, multiInject} from "inversify";
import {ICommand} from "../core/command";
import {CType, IConfig} from "../declaration";

@injectable()
export class CliContainer {
    private commander: any;

    constructor(
        @inject(CType.Config)
        private config: IConfig,
        @multiInject(CType.ICommand)
        private commands: ICommand[]
    ) {
        this.buildCommander();
    }

    buildCommander() {
        this.commander = require('commander');
        this.commander
            .version('0.1.0')
            .option('-C, --chdir <path>', 'change the working directory')
            .option('-c, --Config <path>', 'set Config path. defaults to ./deploy.conf')
            .option('-T, --no-tests', 'ignore test hook');
        this.commands.forEach((command: ICommand) => command.build(this.commander));
    }

    getCommands(): ICommand[] {
        return this.commands;
    }

    parse(argv:any) {
        this.commander.parse(argv);
    }
}