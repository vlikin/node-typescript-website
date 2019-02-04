import should = require('should')
import request from 'supertest'
import { CType, IConfig, ITokenData } from '../../declaration'
import { bootstrapServerV2, resolveConfig } from '../../bootstrap'
import { Application } from 'express'
import { ServerV2Container } from '../../container/server-v2'
import { CoreContainer } from '../../container/core'
import { ShellContainer } from '../../container/shell'
import { InitialDataContainer } from '../../container/initial-data'
import { IPostData, PostModel } from '../../model/post'
import _ from 'lodash'
import { ObjectID } from 'bson'
import { IResumeData, ResumeModel } from '../../model/resume'
import * as path from "path"
import * as fs from "fs"

describe('Controller Admin', () => {
  const config: IConfig = resolveConfig()
  const container = bootstrapServerV2(config)
  const coreContainer = container.get<CoreContainer>(CType.Core)
  const postModel = container.get<PostModel>(CType.Content.Post)
  const resumeModel = container.get<ResumeModel>(CType.Content.Resume)
  const shellContainer = container.get<ShellContainer>(CType.Shell)
  const initialDataContainer = container.get<InitialDataContainer>(CType.InitialData)
  const serverContainer = container.get<ServerV2Container>(CType.Server)
  const app = container.get<Application>(CType.App)
  serverContainer.build()
  const tokenData: ITokenData = {
    id: 'admin'
  }
  const authToken = coreContainer.generateToken(tokenData)
  let state: any

  before(async () => {
    await shellContainer.install()
    await initialDataContainer.migrate('.')
  })

  after(async () => {
    await shellContainer.uninstall()
    await shellContainer.dispose()
  })

  it('Forbidden', async () => {
    const response = await request(app)
      .get('/v2/admin/page/get')
      .expect(403)
  })

  it('Client Config', async () => {
    const response = await request(app)
      .get('/v2/admin/client-config')
      .set('Authentication', `bearer ${authToken}`)
      .expect(200)
    should(response.body.config.defaultLanguage).equal('en')
  })

  describe('Page', () => {
    it('Get', async () => {
      let response = await request(app)
        .get('/v2/admin/page/get')
        .set('Authentication', `bearer ${authToken}`)
        .expect(200)
      state = response.body.state
      should(state.section).not.null()
    })

    it('Set', async () => {
      let value = 'Value has been changed'
      state.component.header.translations.en.menu.home = value
      await request(app)
        .post('/v2/admin/page/set')
        .send({ state })
        .set('Authentication', `bearer ${authToken}`)
        .expect(200)

      let response = await request(app)
        .get('/v2/admin/page/get')
        .set('Authentication', `bearer ${authToken}`)
        .expect(200)
      state = response.body.state
      should(state.component.header.translations.en.menu.home).equal(value)
    })
  })

  describe('Post', () => {
    let post: IPostData = {
      link: 'postLink',
      date: new Date(),
      translations: {
        en: { title: 'enPostTitle' },
        ru: { title: 'ruPostTitle' },
        ua: { title: 'uaPostTitle' }
      }
    }

    before(async () => {
      await postModel.create(Object.assign({}, post))
      await postModel.create(Object.assign({}, post))
      await postModel.create(Object.assign({}, post))
    })

    it('Create', async () => {
      let response = await request(app)
        .post('/v2/admin/post/create')
        .set('Authentication', `bearer ${authToken}`)
        .send({ item: post })
        .expect(200)
      post._id = response.body._id
      should(response.body._id).not.undefined()
    })

    it('Get', async () => {
      let response = await request(app)
        .post('/v2/admin/post/get')
        .set('Authentication', `bearer ${authToken}`)
        .send({ _id: post._id })
        .expect(200)
      post = response.body.item
      should(response.body.item.translations.en.title).equal('enPostTitle')
    })

    it('Save', async () => {
      post.translations.en.title = 'updated'
      await request(app)
        .post('/v2/admin/post/save')
        .set('Authentication', `bearer ${authToken}`)
        .send({ item: post })
        .expect(200)
      let updatedRPost = await postModel.get(new ObjectID(post._id))
      should(updatedRPost.translations['en'].title).equal(post.translations['en'].title)
    })

    it('Delete', async () => {
      await request(app)
        .post('/v2/admin/post/delete')
        .set('Authentication', `bearer ${authToken}`)
        .send({ _id: post._id })
        .expect(200)
      let nullPost = await postModel.get(new ObjectID(post._id))
      should(nullPost).is.null()
    })

    it('List', async () => {
      let response = await request(app)
        .get('/v2/admin/post/list')
        .set('Authentication', `bearer ${authToken}`)
        .expect(200)
      should(response.body.list.length).above(0)
    })
  })

  describe('Resume', async () => {
    const resumeDict: IResumeData = {
      translations: {
        en: {
          position: 'enPositionString',
          company: 'enPositionString',
          place: 'enPositionString',
          period: 'enPositionString',
          description: 'enPositionString'
        }
      }
    }
    let resume: IResumeData

    before(async () => {
      await resumeModel.create(_.clone(resumeDict))
      await resumeModel.create(_.clone(resumeDict))
      await resumeModel.create(_.clone(resumeDict))
    })

    it('Create', async () => {
      let response = await request(app)
        .post('/v2/admin/resume/create')
        .set('Authentication', `bearer ${authToken}`)
        .send({ item: resumeDict })
        .expect(200)
      resumeDict._id = response.body._id
      should(response.body._id).not.undefined()
    })

    it('Get', async () => {
      let response = await request(app)
        .post('/v2/admin/resume/get')
        .send({ _id: resumeDict._id })
        .set('Authentication', `bearer ${authToken}`)
        .expect(200)
      resume = response.body.item
      should(response.body.item.translations.en.position).equal('enPositionString')
    })

    it('Save', async () => {
      resume.translations.en.position = 'updated'
      await request(app)
        .post('/v2/admin/resume/save')
        .set('Authentication', `bearer ${authToken}`)
        .send({ item: resume })
        .expect(200)
      let updatedRResume = await resumeModel.get(new ObjectID(resume._id))
      should(updatedRResume.translations['en'].position).equal(resume.translations['en'].position)
    })

    it('Delete', async () => {
      await request(app)
        .post('/v2/admin/resume/delete')
        .set('Authentication', `bearer ${authToken}`)
        .send({ _id: resume._id })
        .expect(200)
      let nullResume = await resumeModel.get(new ObjectID(resume._id))
      should(nullResume).is.null()
    })

    it('List', async () => {
      let response = await request(app)
        .get('/v2/admin/resume/list')
        .set('Authentication', `bearer ${authToken}`)
        .expect(200)
      should(response.body.list.length).above(0)
    })
  })

  it('Upload the profile document', async () => {
    let filePath = path.resolve(path.join(
      __dirname,
      '../../../fixtures/image.jpg'
    ))
    let response = await request(app)
      .post('/v2/admin/upload-file')
      .set('Authentication', `bearer ${authToken}`)
      .attach('document', filePath)
    let pathToFile = path.join(
      coreContainer.getFileStorageDir(),
      response.body.fileName
    )
    let isUploaded = fs.existsSync(pathToFile)
    should(isUploaded).is.true()
  })
})
