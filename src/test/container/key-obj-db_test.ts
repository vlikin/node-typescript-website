import {bootstrapCore, resolveConfig} from "../../bootstrap";
import {DbContainer} from "../../container/db";
import {CType} from "../../declaration";
import {Db} from "mongodb";
import {BaseMemento, KeyObjDbContainer} from "../../container/key-obj-db";
import should = require("should");

interface ITestData {
    test: string
}

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

    it('Load/Save an object', async () => {
        let key = 'testKey';
        let obj: ITestData = {
            test: 'Test Data'
        };
        await keyObjDbContainer.save(key, obj);
        let loadedObj = await keyObjDbContainer.load<ITestData>(key);
        if (loadedObj) {
            should(obj.test).equal(loadedObj.test);
        }
    });

    it('BaseMemento container', async () => {
        container.bind<BaseMemento<ITestData>>('BaseMemento').to(BaseMemento).inSingletonScope();
        let baseMementoContainer = container.get<BaseMemento<ITestData>>('BaseMemento');
        let state: ITestData = {
            test: 'Test String'
        };
        await baseMementoContainer.setState(state);
        let loadedState = await baseMementoContainer.getState();
        should(state.test).equal(loadedState.test);
    });

    after(async () => {
        await keyObjDbContainer.uninstall();
        let collections = await db.listCollections().toArray();
        should(collections.length).equal(0);
        await dbContainer.dispose();
    });
});
