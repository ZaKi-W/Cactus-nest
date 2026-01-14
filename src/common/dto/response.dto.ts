/**
 * 全局统一返回格式的实体类
 * 所有接口的返回数据都会包装成这个格式
 */
export class ResponseResult<T = any> {
  // 自定义业务状态码 【核心】前端判断的依据
  code: number;
  // 提示信息
  msg: string;
  // 返回的数据，泛型支持任意类型，无数据时为null
  data: T;

  // 成功的静态方法：快捷返回成功结果
  static success<T>(data: T, msg: string = '操作成功') {
    const result = new ResponseResult<T>();
    result.code = 200; // 约定：200 = 业务请求成功
    result.msg = msg;
    result.data = data;
    return result;
  }

  // 失败的静态方法：快捷返回失败结果
  static error(code: number = 400, msg: string = '操作失败') {
    const result = new ResponseResult();
    result.code = code; // 自定义失败状态码
    result.msg = msg;
    result.data = null;
    return result;
  }
}
