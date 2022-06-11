import { JSONSchemaType } from 'ajv';
import { ProductToSave } from '../../model/products/ProductStore';
import ajvValidator from '../../utilities/ajvValidator';

const schema: JSONSchemaType<ProductToSave> = {
  type: 'object',
  properties: {
    name: { type: 'string', maxLength: 50 },
    price: { type: 'number', minimum: 0 },
  },
  required: ['name', 'price'],
  additionalProperties: false,
};

const validate = ajvValidator.compile(schema);

export default validate;
