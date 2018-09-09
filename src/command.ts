import {inject, injectable} from "inversify";
import {AbstractCommand} from './core/command';
import {CType, IConfig} from "./declaration";

@injectable()
export class InquirerCommand extends AbstractCommand {
    info() {
        return {
            command: 'setup [env]',
            description: 'Setup Description',
            options: [
                "-s, --setup_mode [mode]", "Which setup mode to use"
            ]
        }
    }

    command() {
        console.log('Inquirer Coommand.');
    }
}

@injectable()
export class CrazyCommand extends AbstractCommand {
    constructor(
        @inject(CType.Config)
        private config: IConfig) {
        super();
    }


    info() {
        return {
            command: 'crazy [env]',
            description: 'Crazy Description',
            options: [
                "-s, --setup_mode [mode]", "Which setup mode to use"
            ]
        }
    }

    command() {
        console.log('Crazy Coommand.');
        console.log(this.config.server.port);
    }
}