import 'mocha';
import request from 'supertest';
import {bootstrapServer, resolveConfig} from '../../bootstrap';
import {ServerContainer} from '../../container/server';
import should = require('should');
import {IRoute} from '../../core/route';
import {CType} from '../../declaration';

describe('Server container', () => {
  const config = resolveConfig();
  const container = bootstrapServer(config);
  const serverContainer = container.get<ServerContainer>(CType.Server);
  serverContainer.build();
  const app = serverContainer.application;

  before(() => {
    serverContainer.build();
  });

  it('Checks registered routes', () => {
    let routesFromLocator = container.getAll<IRoute>(CType.IRoute);
    let routesFromContainer = serverContainer.getRoutes();
    should(routesFromLocator.length).above(0);
    should(routesFromLocator.length).equal(routesFromContainer.length);
  });

  it('Static files', async () => {
    should(true).equal(true);
    await request(app)
      .get('/static/image.jpg')
      .expect(200);
  });
});