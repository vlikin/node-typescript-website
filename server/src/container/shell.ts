import {inject, injectable} from "inversify";
import {KeyObjDbContainer} from "./key-obj-db";
import {CType, IConfig} from "../declaration";
import {DbContainer} from "./db";
import {DynamicConfigMemento} from "../memento";
import {PostModel} from "../model/post";

@injectable()
export class ShellContainer {
    @inject(CType.Config)
    private config!: IConfig;
    @inject(CType.Db)
    private dbContainer!: DbContainer;
    @inject(CType.KeyObjDb)
    private keyObjDbContainer!: KeyObjDbContainer;
    @inject(CType.Memento.DynamicConfig)
    private dynamicConfigMemento!: DynamicConfigMemento;

    @inject(CType.Content.Post)
    private postContent!: PostModel;

    test() {
        return 'ShellContainer-test';
    }

    async dispose(): Promise<void> {
        await this.dbContainer.dispose();
    }

    async install(): Promise<void> {
        await this.keyObjDbContainer.install();
        await this.dynamicConfigMemento.setState(this.config.dynamicConfig);

        // Content.
        await this.postContent.install();
    }

    async uninstall() {
        await this.keyObjDbContainer.uninstall();

        // Content.
        await this.postContent.uninstall();
    }
}
