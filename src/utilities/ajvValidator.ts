import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';

const ajvValidator = new Ajv({ allErrors: true }); // options can be passed, e.g. {allErrors: true}
addFormats(ajvValidator);

export default ajvValidator;
