import { JSONSchemaType } from 'ajv';
import { OrderDto } from '../../model/orders/OrderStore';
import ajvValidator from '../../utilities/ajvValidator';

const schema: JSONSchemaType<Omit<OrderDto, 'id'>> = {
  type: 'object',
  properties: {
    userId: { type: 'integer', minimum: 1 },
    status: { type: 'string', enum: ['active', 'complete'] },
    products: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          productId: { type: 'integer', minimum: 1 },
          quantity: { type: 'integer', minimum: 1 },
        },
        required: ['productId', 'quantity'],
        additionalProperties: false,
      },
    },
  },
  required: ['userId', 'status', 'products'],
  additionalProperties: false,
};

const validate = ajvValidator.compile(schema);

export default validate;
