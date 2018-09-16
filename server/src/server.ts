import {Container} from "inversify";
import {bootstrapServer, resolveConfig} from "./bootstrap";
import {ServerContainer} from "./container/server";

let config = resolveConfig();
let container: Container = bootstrapServer(config);
let serverContainer = container.get<ServerContainer>(ServerContainer);
serverContainer.build();
serverContainer.listen();
