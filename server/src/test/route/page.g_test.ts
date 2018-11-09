import {bootstrapServer, resolveConfig} from "../../bootstrap";
import {CType, ITokenData} from "../../declaration";
import {ShellContainer} from "../../container/shell";
import {ServerContainer} from "../../container/server";
import should = require("should");
import {default as request} from "supertest";
  import {CoreContainer} from "../../container/core";
import {InitialDataContainer} from "../../container/initial-data";
import cheerio from 'cheerio';

describe('Page routes', () => {
  const config = resolveConfig();
  const container = bootstrapServer(config);
  const coreContainer = container.get<CoreContainer>(CType.Core);
  const shellContainer = container.get<ShellContainer>(CType.Shell);
  const serverContainer = container.get<ServerContainer>(CType.Server);
  const initialDataContainer = container.get<InitialDataContainer>(CType.InitialData);
  serverContainer.build();
  const app = serverContainer.application;
  const tokenData: ITokenData = {
    id: 'admin'
  };
  const authToken = coreContainer.generateToken(tokenData);
  let state: any;

  before(async () => {
    await shellContainer.install();
    await initialDataContainer.migrate('.');
  });

  describe('Index multilingual page', () => {
    it('Default', async () => {
      let response = await request(app)
        .get('/')
        .set('Authentication', `bearer ${authToken}`)
        .expect(200);
      let doc = cheerio.load(response.text);
      let d = doc('.section.hero .card-title');
      state = response.body.state;
      should(d.text()).equal('Viktor Shelepen');
    });

    it('Ukrainian', async () => {
      let response = await request(app)
        .get('/uk')
        .set('Authentication', `bearer ${authToken}`)
        .expect(200);
      let doc = cheerio.load(response.text);
      let d = doc('.section.hero .card-title');
      state = response.body.state;
      should(d.text()).equal('Віктор Шелепень');
    });
  });

  it('Get', async () => {
    let response = await request(app)
      .get('/admin/page/get')
      .set('Authentication', `bearer ${authToken}`)
      .expect(200);
    state = response.body.state;
    should(state.section).not.null();
  });

  it('Set', async () => {
    let value = 'Value has been changed';
    state.component.header.translations.en.menu.home = value;
    await request(app)
      .post('/admin/page/set')
      .send({state})
      .set('Authentication', `bearer ${authToken}`)
      .expect(200);

    let response = await request(app)
      .get('/admin/page/get')
      .set('Authentication', `bearer ${authToken}`)
      .expect(200);
    state = response.body.state;
    should(state.component.header.translations.en.menu.home).equal(value);
  });

  after(async () => {
    await shellContainer.uninstall();
    await shellContainer.dispose();
  });
});