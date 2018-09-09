import {Container} from "inversify";
import {bootstrapCli, resolveConfig} from "./bootstrap";
import {CliContainer} from "./container/cli";

let config = resolveConfig();
let container: Container = bootstrapCli(config);
let cli = container.get<CliContainer>(CliContainer);
cli.parse(process.argv);
