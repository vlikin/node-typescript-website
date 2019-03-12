import { inject, injectable } from 'inversify'
import { IPostData, PostModel } from '../model/post'
import { CType, IConfig } from '../declaration'
import yaml from 'js-yaml'
import fs from 'fs'
import * as path from 'path'
import { PageMemento } from '../memento/page'
import _ from 'lodash'
import { IResumeData, ResumeModel } from '../model/resume'
import { CoreContainer } from './core'

@injectable()
export class InitialDataContainer {
  @inject(CType.Config)
  private config!: IConfig
  @inject(CType.Core)
  private coreContainer!: CoreContainer
  @inject(CType.Content.Post)
  private postModel!: PostModel
  @inject(CType.Content.Resume)
  private resumeModel!: ResumeModel
  @inject(CType.Memento.Page)
  private pageMemento!: PageMemento

  test () {
    return 'test'
  }

  getInitialData (basePath= '.'): any {
    let parse = (_path: string) => {
      return yaml.safeLoad(fs.readFileSync(
        path.resolve(path.join(basePath, _path)),
        'utf8'
      ))
    }

    return {
      component: {
        header: parse('initial-data/yaml/component/header.yaml'),
        footer: parse('initial-data/yaml/component/footer.yaml')
      },
      section: {
        aboutMe: parse('initial-data/yaml/section/about-me.yaml'),
        blog: parse('initial-data/yaml/section/blog.yaml'),
        contact: parse('initial-data/yaml/section/contact.yaml'),
        hero: parse('initial-data/yaml/section/hero.yaml'),
        resume: parse('initial-data/yaml/section/resume.yaml'),
        services: parse('initial-data/yaml/section/services.yaml')
      }
    }
  }

  async migrateUnstructualParts (_doc: any, basePath: string): Promise<void> {
    const imagePath = path.resolve(path.join(basePath, 'initial-data/images/viktor-snow.jpg'))
    let aboutMeImagePath = this.coreContainer.moveFileToStorage(imagePath, true)

    let doc = _.cloneDeep(_doc)
    let state = {
      component: {
        header: {
          translations: doc.component.header
        },
        footer: {
          translations: doc.component.footer
        }
      },
      section: {
        hero: {
          image: 'default.jpg',
          translations: doc.section.hero
        },
        aboutMe: {
          image: aboutMeImagePath,
          translations: doc.section.aboutMe
        },
        blog: {
          translations: doc.section.blog
        },
        contact: {
          translations: doc.section.contact
        },
        resume: {
          translations: doc.section.resume
        },
        services: {
          translations: doc.section.services
        }
      }
    }

    await this.pageMemento.setState(state)
  }

  async migratePosts (doc: any): Promise<void> {
    doc['ua'] = doc['uk']
    delete doc['uk']
    let posts: IPostData[] = []
    for (let i = 0; i < doc['en']['articles'].length; i++) {
      let defArticle = doc['en']['articles'][i]
      let post: IPostData = {
        link: defArticle.href,
        date: new Date(),
        translations: {}
      }
      this.config.languages.forEach((language) => {
        let oldPost = doc[language]['articles'][i]
        post.translations[language] = {
          title: oldPost['title']
        }
      })
      posts.push(post)
    }
    for (let post of posts) {
      await this.postModel.create(post)
    }
  }

  async migrateResumes (doc: any): Promise<void> {
    doc['ua'] = doc['uk']
    delete doc['uk']
    let resumes: IResumeData[] = []

    _.forEach(doc['en']['position'], (value: any, key: any) => {
      let resume: IResumeData = {
        translations: {}
      }
      this.config.languages.forEach((language) => {
        let oldResume = doc[language]['position'][key]
        resume.translations[language] = oldResume
      })
      resumes.push(resume)
    })
    for (let resume of resumes) {
      await this.resumeModel.create(resume)
    }
  }

  async migrate (basePath= '.'): Promise<void> {
    let doc = this.getInitialData(basePath)
    await this.migrateUnstructualParts(doc, basePath)
    await this.migratePosts(doc.section.blog)
    await this.migrateResumes(doc.section.resume)
  }
}
