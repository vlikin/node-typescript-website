import {default as request} from 'supertest';
import {bootstrapServer, resolveConfig} from "../bootstrap";
import {CType, IConfig} from "../declaration";
import {ServerContainer} from "../container/server";
import should from 'should';
import {ShellContainer} from "../container/shell";

describe('Routes', () => {
  let config: IConfig = resolveConfig();
  const container = bootstrapServer(config);
  const shellContainer = container.get<ShellContainer>(CType.Shell);
  const serverContainer = container.get<ServerContainer>(CType.Server);
  serverContainer.build();
  const app = serverContainer.application;
  let authToken: string = config.dynamicConfig.adminPassword;

  before(async () => {
    await shellContainer.install();
  });

  after(async () => {
    await shellContainer.uninstall();
    await shellContainer.dispose();
  });

  describe('Token middleware.', () => {
    it('Test route', async () => {
      let response = await request(app)
        .get('/test')
        .expect(200);
      let testText = `Hello route ${config.server.port}`;
      should(response.text).equal(testText);
    });

    it('Wrong admin token', async () => {
      await request(app)
        .get('/admin/client-config')
        .set('Authorization', `bearer wrong${authToken}`)
        .expect(403);
    });

    it('Right admin token', async () => {
      let response = await request(app)
        .get('/admin/client-config')
        .set('Authorization', `bearer ${authToken}`)
        .expect(200);
      should(response.body.config.defaultLanguage).equal('en');
    });
  });

  describe('Token retrievement.', () => {
    it('Wrong password', async () => {
      return await request(app)
        .post('/get-token')
        .send({password: 'wrong'})
        .expect(202);
    });

    it('Right password', async () => {
      let response = await request(app)
        .post('/get-token')
        .send({password: 'admin'})
        .expect(200);
      should(response.body.token.length).above(0);
    });
  });
});
