import {inject, injectable} from "inversify";
import {AbstractCommand} from "../core/command";
import {CType, IConfig} from "../declaration";
import {DynamicConfigMemento} from "../memento";
import {IPostData, PostModel} from "../model/post";
import {ShellContainer} from "../container/shell";
import yaml from "js-yaml";
import fs from "fs";
import 'colors';

@injectable()
export class InitialDataCommand extends AbstractCommand {
  @inject(CType.Config)
  private config!: IConfig;
  @inject(CType.Memento.DynamicConfig)
  private dynamicConfig!: DynamicConfigMemento;
  @inject(CType.Content.Post)
  private postModel!: PostModel;
  @inject(CType.Shell)
  private shellContainer!: ShellContainer;

  info() {
    return {
      command: 'initial-data',
      description: 'Sets initial data.',
      options: []
    }
  }

  async migratePosts(path: string): Promise<void> {
    let doc = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
    doc['ua'] = doc['uk'];
    delete doc['uk'];
    let posts: IPostData[] = [];
    for (let i = 0; i < doc['en']['articles'].length; i++) {
      let defArticle = doc['en']['articles'][i];
      let post: IPostData = {
        link: defArticle.href,
        date: new Date(),
        translations: {}
      };
      this.config.languages.forEach((language) => {
        let oldPost = doc[language]['articles'][i];
        post.translations[language] = {
          title: oldPost['title']
        }
      });
      posts.push(post);
    }
    posts.forEach(async (post) => {
      return await this.postModel.create(post)
    });

  }

  async command(env: any, options: any): Promise<void> {
    // await this.shellContainer.uninstall();
    // await this.shellContainer.install();

    const postFile = 'yaml/section/blog.yaml';
    await this.migratePosts(postFile);
    await this.shellContainer.dispose();

    console.log('Posts have been migrated!'.red);
  }
}
