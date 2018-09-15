import {bootstrapCore, resolveConfig} from "../../bootstrap";
import {CType} from "../../declaration";
import should = require("should");
import {ShellContainer} from "../../container/shell";

describe('Shell Container', () => {
    const config = resolveConfig();
    const container = bootstrapCore(config);
    const shellContainer = container.get<ShellContainer>(CType.Shell);

    before(async () => {
        await shellContainer.install();
    });

    it('Shell', () => {
        let test = shellContainer.test();
        should(test).equal('ShellContainer-test')
    });

    after(async () => {
        await shellContainer.uninstall();
        await shellContainer.dispose();
    });
});
