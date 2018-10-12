import {bootstrapCore, resolveConfig} from '../../bootstrap';
import {CoreContainer} from '../../container/core';
import {CType, ITokenData} from '../../declaration';
import should = require('should');

describe('Core Container', () => {
  const config = resolveConfig();
  const container = bootstrapCore(config);
  const coreContainer = container.get<CoreContainer>(CType.Core);

  before(async () => {
    await coreContainer.install();
  });

  after(async () => {
    await coreContainer.uninstall();
  });

  it('Generate/validate hash', () => {
    let word = 'adminPassword';
    let hash = coreContainer.generateHash(word);
    let isCorresponded = coreContainer.validateHash(word, hash);
    should(isCorresponded).is.true();
  });

  it('Generate/decode token', () => {
    let tokenData: ITokenData = {
      id: '+id+'
    };
    let token = coreContainer.generateToken(tokenData);
    let decodedData = coreContainer.decodeToken(token);
    should(tokenData.id).equal(decodedData.id);
  });

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
    };
    coreContainer.processSchemaProperty(property);
    should(property.type).equal('object');
    should(property.properties.translations.properties.en.properties.title.type).equal('string');
  });
});
