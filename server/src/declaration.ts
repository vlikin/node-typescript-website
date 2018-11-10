export type IDynamicConfig = {
  adminPassword: string
}

export type IConfig = {
  secret: string,
  static: [{
    path: string,
    dir: string
  }],
  server: {
    port: number
  },
  fileStorage: string,
  languages: string[],
  db: {
    name: string,
    port: number,
    host: string
  },
  dynamicConfig: IDynamicConfig,
  client: {
    defaultLanguage: string;
  }
}

export interface IInstallable {
  install (): Promise<void>,

  uninstall (): Promise<void>
}

export interface ISaveable {
  save (): Promise<void>

  load (): Promise<any>
}

export interface ITokenData {
  id: string
  iat?: string
}

export const CType = {
  Core: Symbol.for('Core'),
  Shell: Symbol.for('Shell'),
  Config: Symbol.for('Config'),
  Cli: Symbol.for('Cli'),
  InitialData: Symbol.for('InitialData'),
  Db: Symbol.for('Db'),
  KeyObjDb: Symbol.for('KeyObjDb'),
  Server: Symbol.for('Server'),
  ICommand: Symbol.for('ICommand'),
  IRoute: Symbol.for('IRoute'),
  Memento: {
    DynamicConfig: Symbol.for('DynamicConfig'),
    Page: Symbol.for('Page')
  },
  Content: {
    Post: Symbol.for('Content'),
    Resume: Symbol.for('Resume')
  }
}
