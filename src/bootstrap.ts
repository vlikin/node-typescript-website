import "reflect-metadata";
import {Container} from 'inversify';
import {ICommand} from "./core/command";
import {CliContainer} from "./container/cli";
import {CrazyCommand, InquirerCommand} from "./command";
import {TestRoute} from "./route";
import {IRoute} from "./core/route";
import {ServerContainer} from "./container/server";
import {CType, IConfig} from "./declaration";
import {DbContainer} from "./container/db";
import {KeyObjDbContainer} from "./container/key-obj-db";

declare var process : {
    env: {
        configFile: string
    }
};


export function resolveConfig(configFile: string | null = null): IConfig {
    if (!configFile) {
        if (process.env.configFile) {
            configFile = process.env.configFile;
        }
        else {
            configFile = 'default.js'
        }
    }

    return require(configFile);
}

/**
 * Creates the start point of the application. The first step on the first layer.
 */
export function bootstrapCore(config: IConfig): Container {
    let container: Container = new Container();
    container.bind<IConfig>(CType.Config).toConstantValue(config);
    container.bind<DbContainer>(CType.Db).to(DbContainer).inSingletonScope();
    container.bind<KeyObjDbContainer>(CType.KeyObjDb).to(KeyObjDbContainer).inSingletonScope();

    return container;
}

/**
 * Creates the start point of the application. The second layer.
 * It is used for Cli applications.
 */
export function bootstrapCli(config: IConfig): Container {
    let container: Container = bootstrapCore(config);
    container.bind<CliContainer>(CType.Cli).to(CliContainer).inSingletonScope();

    // Registers commands.
    container.bind<ICommand>(CType.ICommand).to(InquirerCommand);
    container.bind<ICommand>(CType.ICommand).to(CrazyCommand);

    return container;
}

/**
 * Creates the start point of the application. The second layer.
 * It is used for a web application..
 */
export function bootstrapServer(config: IConfig): Container {
    let container: Container = bootstrapCore(config);
    container.bind<ServerContainer>(CType.Server).to(ServerContainer).inSingletonScope();

    // Registers routes.
    container.bind<IRoute>(CType.IRoute).to(TestRoute);

    return container;
}
