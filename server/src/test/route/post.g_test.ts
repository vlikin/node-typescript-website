import {bootstrapServer, resolveConfig} from "../../bootstrap";
import {ShellContainer} from "../../container/shell";
import {CType, ITokenData} from "../../declaration";
import {CoreContainer} from "../../container/core";
import {default as request} from "supertest";
import should from "should";
import {ServerContainer} from "../../container/server";
import {IPostData, PostModel} from "../../model/post";
import _ from "lodash";
import {ObjectID} from "bson";

describe('Post routes', () => {
  const config = resolveConfig();
  const container = bootstrapServer(config);
  const coreContainer = container.get<CoreContainer>(CType.Core);
  const shellContainer = container.get<ShellContainer>(CType.Shell);
  const serverContainer = container.get<ServerContainer>(CType.Server);
  const postModel = container.get<PostModel>(CType.Content.Post);
  serverContainer.build();
  const app = serverContainer.application;
  const tokenData: ITokenData = {
    id: 'admin'
  };
  const authToken = coreContainer.generateToken(tokenData);
  let post: IPostData = {
    link: 'postLink',
    date: new Date(),
    translations: {
      en: {title: 'enPostTitle'},
      ru: {title: 'ruPostTitle'},
      ua: {title: 'uaPostTitle'},
    }
  };

  before(async () => {
    await shellContainer.install();

    // Create.
    await postModel.create(_.clone(post));
    await postModel.create(_.clone(post));
    await postModel.create(_.clone(post));
  });

  it('Create', async () => {
    let response = await request(app)
      .post('/admin/post/create')
      .set('Authentication', `bearer ${authToken}`)
      .send({item: post})
      .expect(200);
    post._id = response.body._id;
    should(response.body._id).not.undefined();
  });

  it('Get', async () => {
    let response = await request(app)
      .post('/admin/post/get')
      .send({_id: post._id})
      .set('Authentication', `bearer ${authToken}`)
      .expect(200);
    post = response.body.item;
    should(response.body.item.translations.en.title).equal('enPostTitle');
  });

  it('Save', async () => {
    post.translations.en.title = 'updated';
    await request(app)
      .post('/admin/post/save')
      .set('Authentication', `bearer ${authToken}`)
      .send({item: post})
      .expect(200);
    let updatedRPost =  await postModel.get(new ObjectID(post._id));
    should(updatedRPost.translations['en'].title).equal(post.translations['en'].title);
  });

  it('Delete', async () => {
    await request(app)
      .post('/admin/post/delete')
      .set('Authentication', `bearer ${authToken}`)
      .send({_id: post._id})
      .expect(200);
    let nullPost = await postModel.get(new ObjectID(post._id));
    should(nullPost).is.null();
  });

  it('List', async () => {
    let response = await request(app)
      .get('/admin/post/list')
      .set('Authentication', `bearer ${authToken}`)
      .expect(200);
    should(response.body.list.length).above(0);
  });

  after(async () => {
    await shellContainer.uninstall();
    await shellContainer.dispose();
  });

});