import { Response } from "express";
import { Logger } from "./logger";

export abstract class ResponseCode {
  static ok0 = 0x00; // 0
  static notAuthenticated16 = 0x10; // 16
  static authFailed17 = 0x11; // 17
  static sessionExpired18 = 0x12; // 18
  static insufficientRights19 = 0x13; // 19
  static identifiersInvalid20 = 0x14; // 20
  static unverifiedAccount21 = 0x15; // 21
  static unactiveAccount22 = 0x16; // 22
  static emailAlreadyExist23 = 0x17; // 23
  static notFound32 = 0x20; // 32
  static invalidData33 = 0x21; // 33
  static exception48 = 0x30; // 48
}

// export class HttpStatusError extends Error {
//   httpMessage: string;
//   constructor(message: any, responseCode: number) {
//     super(message);
//     this.httpMessage = httpStatusMessage(responseCode);
//   }
// }

export function writeJsonResponse(res: Response, data: object) {
  res.setHeader("Content-Type", "application/json");
  res.status(200);
  res.send({ _code: ResponseCode.ok0, ...data });
  res.end();
}

export function writeError(
  res: Response,
  responseCode: number,
  message: undefined | string = undefined
) {
  const {msg, httpStatusCode} = httpStatusMessage(responseCode);
  Logger.error(message ?? msg)
  res.status(httpStatusCode);
  res.send({
    _code: responseCode,
    message: message || msg,
  });
  res.end();
}

export function httpStatusMessage(responseCode: number): {
  msg: string;
  httpStatusCode: number;
} {
  let msg;
  let httpStatusCode;
  switch (responseCode) {
    case ResponseCode.ok0:
      msg = "Success";
      httpStatusCode = 200;
      break;
    case ResponseCode.notAuthenticated16:
      msg = "You're not authenticated";
      httpStatusCode = 401;
      break;
    case ResponseCode.authFailed17:
      msg = "Auth failed";
      httpStatusCode = 400;
      break;
    case ResponseCode.sessionExpired18:
      msg = "Your sessios has expired";
      httpStatusCode = 401;
      break;
    case ResponseCode.insufficientRights19:
      msg = "Insufficient rights";
      httpStatusCode = 403;
      break;
    case ResponseCode.identifiersInvalid20:
      msg = "Invalid identifiers";
      httpStatusCode = 400;
      break;
    case ResponseCode.unverifiedAccount21:
      msg = "Action denied for unverified account";
      httpStatusCode = 403;
      break;
    case ResponseCode.unactiveAccount22:
      msg = "Action denied for unactive account";
      httpStatusCode = 403;
      break;
    case ResponseCode.emailAlreadyExist23:
      msg = "Email already exist";
      httpStatusCode = 400;
      break;
    case ResponseCode.notFound32:
      msg = "Not found";
      httpStatusCode = 404;
      break;
    case ResponseCode.invalidData33:
      msg = "Invalid data provided";
      httpStatusCode = 400;
      break;
    case ResponseCode.exception48:
      msg = "An unexepected error occured";
      httpStatusCode = 500;
      break;
    default:
      msg = `Error ${responseCode}`;
      httpStatusCode = 500;
      break;
  }

  return { msg, httpStatusCode };
}
