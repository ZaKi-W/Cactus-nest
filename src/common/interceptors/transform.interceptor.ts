import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ResponseResult } from '../dto/response.dto';

/**
 * 全局响应拦截器：统一接口返回格式
 * 所有接口的返回数据都会经过这个拦截器包装
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 拦截返回结果，统一包装格式
    return next.handle().pipe(
      map((data) => {
        // data就是你接口return的原始数据，自动包装成统一格式
        return ResponseResult.success(data);
      }),
    );
  }
}
