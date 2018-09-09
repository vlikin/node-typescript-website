import {promises} from "fs";

export type IConfig = {
    server: {
        port: number
    },
    db: {
        name: string,
        port: number,
        host: string
    }
}

export interface IInstallable {
    install(): Promise<void>,
    uninstall(): Promise<void>
}

export const CType = {
    Config: Symbol.for('Config'),
    Cli: Symbol.for('Cli'),
    Db: Symbol.for('Db'),
    KeyObjDb: Symbol.for('KeyObjDb'),
    Server: Symbol.for('Server'),
    ICommand: Symbol.for('ICommand'),
    IRoute: Symbol.for('IRoute')
};
