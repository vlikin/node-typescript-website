import "reflect-metadata";
import {Container} from 'inversify';
import {ICommand} from "./core/command";
import {CliContainer} from "./container/cli";
import {
    ChangeAdminPasswordCommand,
    InstallCommand,
    ReinstallCommand,
    UninstallCommand
} from "./command/index";
import {ClientConfigAdminRoute, GetTokenRoute, TestRoute} from "./route";
import {IRoute} from "./core/route";
import {ServerContainer} from "./container/server";
import {CType, IConfig} from "./declaration";
import {DbContainer} from "./container/db";
import {KeyObjDbContainer} from "./container/key-obj-db";
import {DynamicConfigMemento} from "./memento";
import {CoreContainer} from "./container/core";
import {ShellContainer} from "./container/shell";
import {PostModel} from "./model/post";
import {InitialDataCommand} from "./command/initial-data";

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
    container.bind<CoreContainer>(CType.Core).to(CoreContainer).inSingletonScope();
    container.bind<DbContainer>(CType.Db).to(DbContainer).inSingletonScope();
    container.bind<KeyObjDbContainer>(CType.KeyObjDb).to(KeyObjDbContainer).inSingletonScope();
    container.bind<DynamicConfigMemento>(CType.Memento.DynamicConfig).to(DynamicConfigMemento).inSingletonScope()

    return container;
}

/**
 * Creates the top library layer. The application layers are based on.
 */
export function bootstrapShell(config: IConfig): Container {
    let container: Container = bootstrapCore(config);

    // Content models.
    container.bind<PostModel>(CType.Content.Post).to(PostModel).inSingletonScope();

    container.bind<ShellContainer>(CType.Shell).to(ShellContainer).inSingletonScope();

    return container;
}

/**
 * Creates the start point of the application. The second layer.
 * It is used for Cli applications.
 */
export function bootstrapCli(config: IConfig): Container {
    let container: Container = bootstrapShell(config);
    container.bind<CliContainer>(CType.Cli).to(CliContainer).inSingletonScope();

    // Registers commands.
    container.bind<ICommand>(CType.ICommand).to(InstallCommand);
    container.bind<ICommand>(CType.ICommand).to(UninstallCommand);
    container.bind<ICommand>(CType.ICommand).to(ReinstallCommand);
    container.bind<ICommand>(CType.ICommand).to(ChangeAdminPasswordCommand);
    container.bind<ICommand>(CType.ICommand).to(InitialDataCommand);

    return container;
}

/**
 * Creates the start point of the application. The second layer.
 * It is used for a web applications.
 */
export function bootstrapServer(config: IConfig): Container {
    let container: Container = bootstrapShell(config);
    container.bind<ServerContainer>(CType.Server).to(ServerContainer).inSingletonScope();

    // Registers routes.
    container.bind<IRoute>(CType.IRoute).to(TestRoute);
    container.bind<IRoute>(CType.IRoute).to(ClientConfigAdminRoute);
    container.bind<IRoute>(CType.IRoute).to(GetTokenRoute);

    return container;
}
