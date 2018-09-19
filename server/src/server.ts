import {Container} from "inversify";
import {bootstrapServer, resolveConfig} from "./bootstrap";
import {ServerContainer} from "./container/server";
import {CType} from "./declaration";

let config = resolveConfig();
let container: Container = bootstrapServer(config);
let serverContainer = container.get<ServerContainer>(CType.Server);
serverContainer.build();
serverContainer.listen();
