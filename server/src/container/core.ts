import {inject, injectable} from "inversify";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {CType, IConfig, IInstallable, ITokenData} from "../declaration";
import * as path from "path";
import * as fs from 'fs';
import _ from 'lodash';
import rimraf = require("rimraf");


@injectable()
export class CoreContainer implements IInstallable {
  constructor(
    @inject(CType.Config)
    private config: IConfig
  ) {
  }

  generateHash(word: string): string {
    return bcrypt.hashSync(word, bcrypt.genSaltSync(8));
  }

  validateHash(word: string, hash: string): boolean {
    return bcrypt.compareSync(word, hash);
  }

  generateToken(data: ITokenData): string {
    return jwt.sign(data, this.config.secret);
  }

  decodeToken(token: string): ITokenData {
    return <ITokenData>jwt.verify(token, this.config.secret);
  }

  getAppRootDir() {
    return path.resolve(path.join(__dirname, '..'))
  }

  processSchemaProperty(property: any) {
    _.forEach(property.properties, (property) => {
      if (property.type == 'object') this.processSchemaProperty(property);
      if (property.type == 'multi-lang') {
        let properties: {[k: string]: any} = {};
        this.config.languages.forEach((key) => {
          properties[key] = {
            type: 'object',
            properties: property.properties
          }
        });

        property.type = 'object';
        property.properties = properties;
      }
    })
  }

  getFileStorageDir() {
    return path.resolve(path.join(
      this.getAppRootDir(),
      this.config.fileStorage
    ));
  }

  install(): Promise<void> {
    let fileStorageDir = this.getFileStorageDir();
    if (!fs.existsSync(fileStorageDir)) {
      fs.mkdirSync(fileStorageDir);
    }

    return Promise.resolve();
  }

  uninstall(): Promise<void> {
    let fileStorageDir = this.getFileStorageDir();
    if (fs.existsSync(fileStorageDir)) {
      rimraf.sync(fileStorageDir);
    }

    return Promise.resolve();
  }

}
