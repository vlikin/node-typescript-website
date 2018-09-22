import {default as request} from 'supertest';
import {bootstrapServer, resolveConfig} from "../../bootstrap";
import {CType, IConfig, ITokenData} from "../../declaration";
import {ServerContainer} from "../../container/server";
import should from 'should';
import {ShellContainer} from "../../container/shell";
import {CoreContainer} from "../../container/core";

describe('Routes', () => {
  let config: IConfig = resolveConfig();
  const container = bootstrapServer(config);
  const coreContainer = container.get<CoreContainer>(CType.Core);
  const shellContainer = container.get<ShellContainer>(CType.Shell);
  const serverContainer = container.get<ServerContainer>(CType.Server);
  serverContainer.build();
  const app = serverContainer.application;
  let rTokenData: ITokenData = {
    id: 'admin'
  };
  let rAuthToken = coreContainer.generateToken(rTokenData);
  let wTokenData: ITokenData = {
    id: 'wrong'
  };
  let wAuthToken = coreContainer.generateToken(wTokenData);

  before(async () => {
    await shellContainer.install();
  });

  after(async () => {
    await shellContainer.uninstall();
    await shellContainer.dispose();
  });

  describe('Json Schema request validation', () => {
    it('Wrong schema', async () => {
      let response = await request(app)
        .post('/test')
        .send({email: 'admintest.com'})
        .expect(403);
    });

    it('Right schema', async () => {
      let response = await request(app)
        .post('/test')
        .send({email: 'admin@test.com'})
        .expect(200);
      let testText = `Hello route ${config.server.port}`;
      should(response.text).equal(testText);
    });
  });

  describe('Token middleware.', () => {

    it('Wrong admin token', async () => {
      await request(app)
        .get('/admin/client-config')
        .set('Authentication', `bearer ${wAuthToken}`)
        .expect(403);
    });

    it('Right admin token', async () => {
      let response = await request(app)
        .get('/admin/client-config')
        .set('Authentication', `bearer ${rAuthToken}`)
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
