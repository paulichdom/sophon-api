import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    console.log("I'm running before the handler ", { context, handler });

    return handler.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out
        console.log("I'm running before response is sent out", { data });
      }),
    );
  }
}
