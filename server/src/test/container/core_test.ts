import { bootstrapCore, resolveConfig } from '../../bootstrap'
import { CoreContainer } from '../../container/core'
import { CType, ITokenData } from '../../declaration'
import should = require('should')
import * as path from 'path'
import { file } from 'babel-types'
import * as fs from 'fs'

describe('Core Container', () => {
  const config = resolveConfig()
  const container = bootstrapCore(config)
  const coreContainer = container.get<CoreContainer>(CType.Core)

  before(async () => {
    await coreContainer.install()
  })

  after(async () => {
    await coreContainer.uninstall()
  })

  it('Generate/validate hash', () => {
    let word = 'adminPassword'
    let hash = coreContainer.generateHash(word)
    let isCorresponded = coreContainer.validateHash(word, hash)
    should(isCorresponded).is.true()
  })

  it('Generate/decode token', () => {
    let tokenData: ITokenData = {
      id: '+id+'
    }
    let token = coreContainer.generateToken(tokenData)
    let decodedData = coreContainer.decodeToken(token)
    should(tokenData.id).equal(decodedData.id)
  })

  it('Process schema', () => {
    let property: any = {
      type: 'object',
      properties: {
        translations: {
          type: 'multi-lang',
          properties: {
            title: {
              type: 'string'
            }
          }
        }
      }
    }
    coreContainer.processSchemaProperty(property)
    should(property.type).equal('object')
    should(property.properties.translations.properties.en.properties.title.type).equal('string')
  })

  it('Move a file to the storage', () => {
    let filePath = path.resolve(path.join(
      __dirname,
      '../../../fixtures/image.jpg'
    ))
    let copiedFilePath = path.resolve(path.join(
      __dirname,
      '../../../fixtures/image-copy.jpg'
    ))
    fs.copyFileSync(filePath, copiedFilePath)
    let fileName = coreContainer.moveFileToStorage(copiedFilePath)
    should(fileName).not.null()
    let movedFilePath = path.join(
      coreContainer.getFileStorageDir(),
      fileName
    )
    let fileExists = fs.existsSync(movedFilePath)
    should(fileExists).be.true()
    fileExists = fs.existsSync(copiedFilePath)
    should(fileExists).be.false()
  })
})
