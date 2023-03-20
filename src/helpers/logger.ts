import logger from "pino";

export abstract class Logger {

  static info(param: string, obj = {}) {
    logger().info(obj, param)
  }

  static war(param: string) {
    logger().warn(param)
  }

  static error(param: string) {
    logger().error(param)
  }

  static debug(param: string) {
    logger().debug(param)
  }
}