import 'mocha';
import {bootstrapServer, resolveConfig} from "../../bootstrap";
import {ServerContainer} from "../../container/server";
import should = require("should");
import {IRoute} from "../../core/route";
import {CType} from "../../declaration";

describe('Server container', () => {
    const config = resolveConfig();
    const container = bootstrapServer(config);
    const serverContainer = container.get<ServerContainer>(CType.Server);

    before(() => {
        serverContainer.build();
    });

    it('Checks registered routes', () => {
        let routesFromLocator = container.getAll<IRoute>(CType.IRoute);
        let routesFromContainer = serverContainer.getRoutes();
        should(routesFromLocator.length).above(0);
        should(routesFromLocator.length).equal(routesFromContainer.length)
    })
});