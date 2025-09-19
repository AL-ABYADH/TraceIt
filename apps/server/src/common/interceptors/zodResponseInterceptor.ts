import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import type { ZodSchema } from "zod";
import { RESPONSE_SCHEMA_KEY } from "../decorators/response-schema.decorator";
import { formatZodErrors } from "../utils/zod";

@Injectable()
export class ZodResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const schema = this.reflector.get<ZodSchema<any>>(RESPONSE_SCHEMA_KEY, context.getHandler());
    if (!schema) return next.handle();

    return next.handle().pipe(
      map((data) => {
        const result = schema.safeParse(data);
        if (result.success) return result.data;

        // Response validation failure indicates a server-side issue: 500
        const errorPayload = {
          error: "ResponseValidationFailed",
          statusCode: 500,
          message: "Response schema validation failed",
          data: { errors: formatZodErrors(result.error) },
        };

        throw new InternalServerErrorException(errorPayload);
      }),
    );
  }
}
