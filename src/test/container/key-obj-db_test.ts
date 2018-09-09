import {bootstrapCore, resolveConfig} from "../../bootstrap";
import {DbContainer} from "../../container/db";
import {CType} from "../../declaration";
import {Db} from "mongodb";
import {KeyObjDbContainer} from "../../container/key-obj-db";
import should = require("should");

describe('KeyObjDb container', () => {
    const config = resolveConfig();
    const container = bootstrapCore(config);
    const dbContainer = container.get<DbContainer>(CType.Db);
    let db!: Db;
    const keyObjDbContainer = container.get<KeyObjDbContainer>(CType.KeyObjDb);

    before(async () => {
        db = await dbContainer.getDb();
        return await keyObjDbContainer.install();
    });


    it('Checks the collection', async () => {
        let collections = await db.listCollections().toArray();
        should (collections.length).above(0);
    });

    after(async () => {
        await keyObjDbContainer.uninstall();
        let collections = await db.listCollections().toArray();
        should(collections.length).equal(0);
        await dbContainer.dispose();
    });
});
