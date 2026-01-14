import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ResponseResult } from '../dto/response.dto';

/**
 * 全局异常过滤器：统一处理所有异常，返回规范格式
 * 捕获所有异常（内置HttpException + 自定义异常）
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // 获取请求上下文
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // 1. 获取【HTTP状态码】
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 2. 获取【异常的提示信息】
    let message = exception.message || '服务器内部错误，请稍后重试';
    // 如果是Nest内置的HttpException，取其标准错误信息
    if (exception instanceof HttpException) {
      const exceptionRes: any = exception.getResponse();
      message =
        typeof exceptionRes === 'string'
          ? exceptionRes
          : exceptionRes.message || message;
    }

    // 3. 【核心】根据HTTP状态码，匹配对应的【自定义业务状态码】
    let code = 500; // 默认业务失败码
    if (status === HttpStatus.OK) {
      code = 200;
    } else if (status === HttpStatus.BAD_REQUEST) {
      code = 400; // 参数错误/业务逻辑错误（用户名已存在、密码格式错误等）
    } else if (status === HttpStatus.UNAUTHORIZED) {
      code = 401; // 未登录/token过期/身份验证失败（登录失效）
    } else if (status === HttpStatus.FORBIDDEN) {
      code = 403; // 无权限访问（角色不匹配）
    } else if (status === HttpStatus.NOT_FOUND) {
      code = 404; // 接口不存在
    } else {
      code = 500; // 服务端未知错误
    }

    // 4. 统一返回异常格式
    response.status(status).json(ResponseResult.error(code, message));
  }
}
