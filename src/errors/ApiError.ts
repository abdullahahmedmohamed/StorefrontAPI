import { ErrorObject } from 'ajv';
import { StatusCode } from '../constants';
import logger from '../logger';

type ErrorDetails = { field: string; msg: string };

export default class ApiError extends Error {
  constructor(msg: string, public statusCode: StatusCode, public details: ErrorDetails[] | null = null) {
    super(msg);
  }

  static NotFound(msg?: string) {
    return new ApiError(msg ?? 'this resource is not found on the server', StatusCode.NotFound);
  }

  static BadRequest(details: ErrorDetails[], msg?: string) {
    return new ApiError(msg ?? details.map((d) => d.msg).join(), StatusCode.BadRequest, details);
  }

  static BadRequestSimple(msg: string) {
    return new ApiError(msg, StatusCode.BadRequest);
  }

  static BadRequestAjv(errors: ErrorObject<string, Record<string, any>, unknown>[]) {
    const details: ErrorDetails[] = errors.map((e) => {
      if (e.keyword == 'required') {
        return { field: e.params.missingProperty, msg: e.message } as ErrorDetails;
      } else if (e.keyword == 'additionalProperties') {
        return { field: e.params.additionalProperty, msg: e.message } as ErrorDetails;
      } else if (e.schemaPath.startsWith('#/properties')) {
        return { field: e.instancePath.slice(1), msg: e.message } as ErrorDetails;
      } else {
        logger.error('[Ajv]Un Handled Validation Error', { validationError: e });
        return { field: '', msg: e.message } as ErrorDetails;
      }
    });
    return new ApiError('unvalid resource', StatusCode.BadRequest, details);
  }

  static Forbidden() {
    return new ApiError("you don't have access to this resource, please login first", StatusCode.Forbidden);
  }
}
