import {bootstrapShell, resolveConfig} from "../../bootstrap";
import {ShellContainer} from "../../container/shell";
import {CType} from "../../declaration";
import {IPostData, PostModel} from "../../model/post";
import should from 'should';
import _ from 'lodash';

describe('Post model', () => {
   const config = resolveConfig();
   const container = bootstrapShell(config);
   const shellContainer = container.get<ShellContainer>(CType.Shell);
   const postModel = container.get<PostModel>(CType.Content.Post);

   before(async () => {
      await shellContainer.install();
   });

   it('Create/get/update/delete', async () => {
      let post: IPostData = {
          link: 'postLink',
          date: new Date(),
          translations: {
              en: {title: 'enPostTitle'},
              ru: {title: 'ruPostTitle'},
              ua: {title: 'uaPostTitle'},
          }
      };

      // Create.
      await postModel.create(_.clone(post));
      await postModel.create(_.clone(post));
      await postModel.create(_.clone(post));
      let postId = await postModel.create(post);
      should(postId.toHexString().length).above(1);

      // Get.
      let retrievedPost = await postModel.get(postId);
      should(retrievedPost._id!.toHexString()).equal(postId.toHexString());
      should(post.translations['en'].title).equal(retrievedPost.translations['en'].title);

      // Save.
      post.translations['en'].title = 'updated';
      await postModel.save(post);
      let updatedRPost =  await postModel.get(postId);
      should(updatedRPost.translations['en'].title).equal(post.translations['en'].title);

      // Delete.
      await postModel.delete(postId);
      let nullPost = await postModel.get(postId);
      should(nullPost).is.null();

      // List.
      let posts = await postModel.list();
      should(posts.length).above(0);
   });

    after(async () => {
        await shellContainer.uninstall();
        await shellContainer.dispose();
    });
});