import {Container} from "inversify";
import {bootstrapCli, resolveConfig} from "./bootstrap";
import {CliContainer} from "./container/cli";
import {CType} from "./declaration";

let config = resolveConfig();
let container: Container = bootstrapCli(config);
let cli = container.get<CliContainer>(CType.Cli);
cli.parse(process.argv);
