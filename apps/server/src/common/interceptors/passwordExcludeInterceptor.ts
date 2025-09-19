import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { JSONPath } from "jsonpath-plus";

@Injectable()
export class PasswordExcludeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.removePasswords(data);
      }),
    );
  }

  private removePasswords(data: any): any {
    // Handle null/undefined
    if (!data) return data;

    // Create a deep clone to avoid modifying the original
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const clonedData = JSON.parse(JSON.stringify(data));

    // Use JSONPath to locate all objects containing a password field
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const objectsWithPassword = JSONPath({
      path: "$..[?(@.password)]",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      json: clonedData,
    });

    // Remove the password field from each object
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    objectsWithPassword.forEach((obj: any) => {
      if (obj && typeof obj === "object" && "password" in obj) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        delete obj.password;
      }
    });

    return clonedData;
  }
}
