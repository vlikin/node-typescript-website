import { inject, injectable } from 'inversify'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { CType, IConfig, IInstallable, ITokenData } from '../declaration'
import * as path from 'path'
import * as fs from 'fs'
import * as fse from 'fs-extra'
import _ from 'lodash'
import rimraf = require('rimraf')
import uniqId from 'uniqid'

@injectable()
export class CoreContainer implements IInstallable {
  constructor (
    @inject(CType.Config)
    private config: IConfig
  ) {
  }

  generateHash (word: string): string {
    return bcrypt.hashSync(word, bcrypt.genSaltSync(8))
  }

  validateHash (word: string, hash: string): boolean {
    return bcrypt.compareSync(word, hash)
  }

  generateToken (data: ITokenData): string {
    return jwt.sign(data, this.config.secret)
  }

  decodeToken (token: string): ITokenData {
    return jwt.verify(token, this.config.secret) as ITokenData
  }

  getAppRootDir () {
    return path.resolve(path.join(__dirname, '..'))
  }

  moveFileToStorage (filePath: string, copy= false): string {
    let ext = path.extname(filePath)
    let _uniqId = uniqId()
    let fileName = `${_uniqId}${ext}`
    let destinationPath = path.join(
      this.getFileStorageDir(),
      fileName
    )
    if (copy) {
      fse.copyFileSync(
        filePath,
        destinationPath
      )
    } else {
      fse.moveSync(
        filePath,
        destinationPath
      )
    }

    return fileName
  }

  processSchemaProperty (property: any) {
    _.forEach(property.properties, (property) => {
      if (property.type === 'object') this.processSchemaProperty(property)
      if (property.type === 'multi-lang') {
        let properties: {[k: string]: any} = {}
        this.config.languages.forEach((key) => {
          properties[key] = {
            type: 'object',
            properties: property.properties
          }
        })

        property.type = 'object'
        property.properties = properties
      }
    })
  }

  getFileStorageDir () {
    return path.resolve(path.join(
      this.getAppRootDir(),
      this.config.fileStorage
    ))
  }

  install (): Promise<void> {
    let fileStorageDir = this.getFileStorageDir()
    if (!fs.existsSync(fileStorageDir)) {
      fs.mkdirSync(fileStorageDir)
    }

    return Promise.resolve()
  }

  uninstall (): Promise<void> {
    let fileStorageDir = this.getFileStorageDir()
    if (fs.existsSync(fileStorageDir)) {
      rimraf.sync(fileStorageDir)
    }

    return Promise.resolve()
  }

}
