import { inject, injectable } from 'inversify'
import { KeyObjDbContainer } from './key-obj-db'
import { CType, IConfig } from '../declaration'
import { DbContainer } from './db'
import { DynamicConfigMemento } from '../memento/dynamic-config'
import { PostModel } from '../model/post'
import { CoreContainer } from './core'
import { ResumeModel } from '../model/resume'

@injectable()
export class ShellContainer {
  @inject(CType.Config)
  private config!: IConfig
  @inject(CType.Core)
  private coreContainer!: CoreContainer
  @inject(CType.Db)
  private dbContainer!: DbContainer
  @inject(CType.KeyObjDb)
  private keyObjDbContainer!: KeyObjDbContainer
  @inject(CType.Memento.DynamicConfig)
  private dynamicConfigMemento!: DynamicConfigMemento

  @inject(CType.Content.Post)
  private postContent!: PostModel
  @inject(CType.Content.Resume)
  private resumeContent!: ResumeModel

  test () {
    return 'ShellContainer-test'
  }

  async dispose (): Promise<void> {
    await this.dbContainer.dispose()
  }

  async install (): Promise<void> {
    await this.coreContainer.install()
    await this.keyObjDbContainer.install()
    await this.dynamicConfigMemento.setState({ ...this.config.dynamicConfig })

    // Content.
    await this.postContent.install()
    await this.resumeContent.install()
  }

  async uninstall () {
    await this.keyObjDbContainer.uninstall()

    // Content.
    await this.postContent.uninstall()
    await this.resumeContent.uninstall()

    await this.coreContainer.uninstall()
  }
}
