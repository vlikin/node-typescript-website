import {Validator, SchemaError, Schema, Options, SchemaContext, ValidatorResult} from 'jsonschema';

export let validator = new Validator();

validator.addSchema()

validator.attributes.dateObject = (instance:any, schema: Schema, options: Options, ctx: SchemaContext): string | ValidatorResult => {
  let result = new ValidatorResult(instance, schema, options, ctx);
  console.log('Hello');
  return result;
  //if(typeof instance != 'Date') return;

  //return '';
};

export const schemaRules = {
  simpleString: {
    type: 'string',
    maxLengtth: 40
  },
  mongoId: {
    type: 'string',
    pattern: '^[a-f\\d]{24}$'
  }
};
