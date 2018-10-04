import {bootstrapShell, resolveConfig} from "../../bootstrap";
import {ShellContainer} from "../../container/shell";
import {CType} from "../../declaration";
import {IResumeData, ResumeModel} from "../../model/resume";
import should from 'should';
import _ from 'lodash';

describe('Post model', () => {
  const config = resolveConfig();
  const container = bootstrapShell(config);
  const shellContainer = container.get<ShellContainer>(CType.Shell);
  const ResumeModel = container.get<ResumeModel>(CType.Content.Resume);

  before(async () => {
    await shellContainer.install();
  });

  it('Create/get/update/delete', async () => {
    let resume: IResumeData = {
      translations: {
        en: {
          position: 'enPositionString',
          company: 'enPositionString',
          place: 'enPositionString',
          period: 'enPositionString',
          description: 'enPositionString'
        }
      }
    };

    // Create.
    await ResumeModel.create(_.clone(resume));
    await ResumeModel.create(_.clone(resume));
    await ResumeModel.create(_.clone(resume));
    let resumeId = await ResumeModel.create(resume);
    should(resumeId.toHexString().length).above(1);

    // Get.
    let retrievedPost = await ResumeModel.get(resumeId);
    should(retrievedPost._id!.toHexString()).equal(resumeId.toHexString());
    should(resume.translations['en'].position).equal(retrievedPost.translations['en'].position);

    // Save.
    resume.translations['en'].position = 'updated';
    await ResumeModel.save(resume);
    let updatedRPost = await ResumeModel.get(resumeId);
    should(updatedRPost.translations['en'].position).equal(resume.translations['en'].position);

    // Delete.
    await ResumeModel.delete(resumeId);
    let nullPost = await ResumeModel.get(resumeId);
    should(nullPost).is.null();

    // List.
    let resumes = await ResumeModel.list();
    should(resumes.length).above(0);
  });

  after(async () => {
    await shellContainer.uninstall();
    await shellContainer.dispose();
  });
});
