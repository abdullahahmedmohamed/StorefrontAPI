import { RouteHandler, RouteHandlerAsync } from '../types/route-handler';

/** higher order functions to catch route handler error and pass it to express error handler middleware */
export default function catchError(hadler: RouteHandler | RouteHandlerAsync): RouteHandler {
  return (req, res, next) => {
    Promise.resolve(hadler(req, res, next)).catch((error) => {
      next(error);
    });
  };
}

// function catchErrorSync(hadler: RouteHandler): RouteHandler {
//     return (req, res, next) => {
//       try {
//         hadler(req, res, next);
//       } catch (error) {
//         next(error);
//       }
//     };
//   }

//   function catchErrorAsync(hadler: RouteHandlerAsync): RouteHandlerAsync {
//     return async (req, res, next) => {
//       try {
//         await hadler(req, res, next);
//       } catch (error) {
//         next(error);
//       }
//     };
//   }
