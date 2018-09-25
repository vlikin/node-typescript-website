import {bootstrapCli, resolveConfig} from '../../bootstrap';
import {ShellContainer} from '../../container/shell';
import {CType} from '../../declaration';
import {InitialDataContainer} from '../../container/initial-data';
import should = require('should');
import {PostModel} from '../../model/post';
import {PageMemento} from "../../memento/page";

describe('Initial Data container', () => {
  const config = resolveConfig();
  const container = bootstrapCli(config);
  const pageMemento = container.get<PageMemento>(CType.Memento.Page);
  const postContainer = container.get<PostModel>(CType.Content.Post);
  const shellContainer = container.get<ShellContainer>(CType.Shell);
  const initialDataContainer = container.get<InitialDataContainer>(CType.InitialData);
  const basePath = '.';

  after(async () => {
    await shellContainer.dispose();
  });

  describe('Step by step', () => {
    let data: any;

    before(async () => {
      await shellContainer.install();
    });

    after(async () => {
      await shellContainer.uninstall();
    });

    it('Initial Data Retrieving', () => {
      data = initialDataContainer.getInitialData(basePath);
      should(data.section).not.null();
    });

    it('Un-structual parts migration', async () => {
      await initialDataContainer.migrateUnstructualParts(data);
      let state = await pageMemento.getState();
      should(state.section).not.null();
    });

    it('Restore posts', async () => {
      let data = initialDataContainer.getInitialData(basePath);
      await initialDataContainer.migratePosts(data.section.blog);
      let posts = await postContainer.list();
      should(posts.length).above(0);
    });
  });

  describe('At once', () => {
    before(async () => {
      await shellContainer.install();
    });

    after(async () => {
      await shellContainer.uninstall();
    });

    it('Migration', async () => {
      await initialDataContainer.migrate(basePath);

      // Checking.
      let state = await pageMemento.getState();
      should(state.section).not.null();
      let posts = await postContainer.list();
      should(posts.length).above(0);
    })
  });
});
