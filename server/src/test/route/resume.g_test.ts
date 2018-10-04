import {bootstrapServer, resolveConfig} from "../../bootstrap";
import {ShellContainer} from "../../container/shell";
import {CType, ITokenData} from "../../declaration";
import {CoreContainer} from "../../container/core";
import {default as request} from "supertest";
import should from "should";
import {ServerContainer} from "../../container/server";
import {IResumeData, ResumeModel} from "../../model/resume";
import _ from "lodash";
import {ObjectID} from "bson";

describe('Resume routes', () => {
  const config = resolveConfig();
  const container = bootstrapServer(config);
  const coreContainer = container.get<CoreContainer>(CType.Core);
  const shellContainer = container.get<ShellContainer>(CType.Shell);
  const serverContainer = container.get<ServerContainer>(CType.Server);
  const resumeModel = container.get<ResumeModel>(CType.Content.Resume);
  serverContainer.build();
  const app = serverContainer.application;
  const tokenData: ITokenData = {
    id: 'admin'
  };
  const authToken = coreContainer.generateToken(tokenData);
  let resume: IResumeData = {
    translations: {
      en: {
        position: 'enPositionString',
        company: 'enPositionString',
        place: 'enPositionString',
        period: 'enPositionString',
        description: 'enPositionString'
      },
    }
  };

  before(async () => {
    await shellContainer.install();

    // Create.
    await resumeModel.create(_.clone(resume));
    await resumeModel.create(_.clone(resume));
    await resumeModel.create(_.clone(resume));
  });

  it('Create', async () => {
    let response = await request(app)
      .post('/admin/resume/create')
      .set('Authentication', `bearer ${authToken}`)
      .send({item: resume})
      .expect(200);
    resume._id = response.body._id;
    should(response.body._id).not.undefined();
  });

  it('Get', async () => {
    let response = await request(app)
      .post('/admin/resume/get')
      .send({_id: resume._id})
      .set('Authentication', `bearer ${authToken}`)
      .expect(200);
    resume = response.body.item;
    should(response.body.item.translations.en.position).equal('enPositionString');
  });

  it('Save', async () => {
    resume.translations.en.position = 'updated';
    await request(app)
      .post('/admin/resume/save')
      .set('Authentication', `bearer ${authToken}`)
      .send({item: resume})
      .expect(200);
    let updatedRResume =  await resumeModel.get(new ObjectID(resume._id));
    should(updatedRResume.translations['en'].position).equal(resume.translations['en'].position);
  });

  it('Delete', async () => {
    await request(app)
      .post('/admin/resume/delete')
      .set('Authentication', `bearer ${authToken}`)
      .send({_id: resume._id})
      .expect(200);
    let nullResume = await resumeModel.get(new ObjectID(resume._id));
    should(nullResume).is.null();
  });

  it('List', async () => {
    let response = await request(app)
      .get('/admin/resume/list')
      .set('Authentication', `bearer ${authToken}`)
      .expect(200);
    should(response.body.list.length).above(0);
  });

  after(async () => {
    await shellContainer.uninstall();
    await shellContainer.dispose();
  });
});
