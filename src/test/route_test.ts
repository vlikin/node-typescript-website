import {default as request} from 'supertest';
import {bootstrapServer, resolveConfig} from "../bootstrap";
import {CType, IConfig} from "../declaration";
import {ServerContainer} from "../container/server";
import should from 'should';

describe('Routes', () => {
    let config: IConfig = resolveConfig();
    const container = bootstrapServer(config);
    const serverContainer = container.get<ServerContainer>(CType.Server);
    serverContainer.build();
    const app = serverContainer.application;

    it('Test route', async () => {
        let response = await request(app)
            .get('/test')
            .expect(200);
        let testText = `Hello route ${config.server.port}`;
        should(response.text).equal(testText);
    });
});
