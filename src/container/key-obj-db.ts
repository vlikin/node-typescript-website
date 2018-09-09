import {inject, injectable} from "inversify";
import {DbContainer} from "./db";
import {CType, IInstallable} from "../declaration";

@injectable()
export class KeyObjDbContainer implements IInstallable {
    private collectionName = 'KeyObjDb';

    constructor(
        @inject(CType.Db)
        private dbContainer: DbContainer
    ) {}

    async install():Promise<void> {
        let db = await this.dbContainer.getDb();
        await db.createCollection<any>(this.collectionName);
        return;
    }

    async uninstall(): Promise<void> {
        let db = await this.dbContainer.getDb();
        await db.dropCollection(this.collectionName);
    }

}