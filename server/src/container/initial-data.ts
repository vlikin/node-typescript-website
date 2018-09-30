import {inject, injectable} from 'inversify';
import {IPostData, PostModel} from '../model/post';
import {CType, IConfig} from '../declaration';
import yaml from 'js-yaml';
import fs from 'fs';
import * as path from 'path';
import {PageMemento} from '../memento/page';
import _ from 'lodash';

@injectable()
export class InitialDataContainer {
  @inject(CType.Config)
  private config!: IConfig;
  @inject(CType.Content.Post)
  private postModel!: PostModel;
  @inject(CType.Memento.Page)
  private pageMemento!: PageMemento;

  test() {
    return 'test';
  }

  getInitialData(basePath='.'): any {
    let parse = (_path: string) => {
      return yaml.safeLoad(fs.readFileSync(
        path.resolve(path.join(basePath, _path)),
        'utf8'
      ));
    };

    return {
      component: {
        header: parse('yaml/component/header.yaml'),
        footer: parse('yaml/component/footer.yaml')
      },
      section: {
        aboutMe: parse('yaml/section/about-me.yaml'),
        blog: parse('yaml/section/blog.yaml'),
        contacts: parse('yaml/section/contact.yaml'),
        hero: parse('yaml/section/hero.yaml'),
        resume: parse('yaml/section/resume.yaml'),
        services: parse('yaml/section/services.yaml')
      }
    };
  }

  async migrateUnstructualParts(doc: any): Promise<void> {
    let state = _.cloneDeep(doc);
    await this.pageMemento.setState(state);
  }

  async migratePosts(doc: any): Promise<void> {
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
    for (let post of posts) {
      await this.postModel.create(post)
    }
  }

  async migrate(basePath='.'): Promise<void> {
    let doc = this.getInitialData(basePath);
    await this.migrateUnstructualParts(doc);
    await this.migratePosts(doc.section.blog);
  }
}