import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { JSONPath } from "jsonpath-plus";
import { instanceToPlain } from "class-transformer";

@Injectable()
export class SensitiveFieldsInterceptor implements NestInterceptor {
  // List of sensitive fields that should be removed
  private readonly sensitiveFields: string[] = ["password", "emailVerified"];

  intercept(_ctx: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.removeSensitiveFields(data)));
  }

  /**
   * Removes sensitive fields from the data object
   * @param data The data to be processed
   * @returns The data after removing sensitive fields
   */
  private removeSensitiveFields(data: any): any {
    // Check if data exists
    if (data == null) return data;

    // Convert objects to plain objects
    const plain = instanceToPlain(data);

    // Create a deep copy of the data
    const cloned = JSON.parse(JSON.stringify(plain));

    // Remove each sensitive field
    for (const field of this.sensitiveFields) {
      const matches = JSONPath({
        path: `$..${field}`,
        json: cloned,
        resultType: "all", // Get parent and parentProperty
      });

      // Delete matching fields
      for (const match of matches) {
        if (match.parent && match.parentProperty) {
          delete match.parent[match.parentProperty];
        }
      }
    }

    return cloned;
  }
}
