import { JSONSchemaType } from 'ajv';
import ajvValidator from '../../utilities/ajvValidator';

const schema: JSONSchemaType<CreateUserDto> = {
  type: 'object',
  properties: {
    userName: { type: 'string', maxLength: 50, minLength: 3 },
    firstName: { type: 'string', maxLength: 50, minLength: 3 },
    lastName: { type: 'string', maxLength: 50, minLength: 3, nullable: true },
    password: { type: 'string', maxLength: 16, minLength: 6 },
  },
  required: ['userName', 'firstName', 'password'],
  additionalProperties: false,
};

const validate = ajvValidator.compile(schema);

export default validate;
