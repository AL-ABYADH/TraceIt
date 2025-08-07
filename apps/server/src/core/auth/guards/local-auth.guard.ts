import { Injectable, ExecutionContext, BadRequestException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { loginSchema } from "@repo/shared-schemas";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // ✅ Validate with Zod before proceeding
    const result = loginSchema.safeParse(request.body);
    if (!result.success) {
      throw new BadRequestException(result.error.format());
    }

    // ✅ Normalize login input
    if (request.body.email) {
      request.body.username = request.body.email;
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}

// import { Injectable, ExecutionContext } from "@nestjs/common";
// import { AuthGuard } from "@nestjs/passport";

// import { Injectable, ExecutionContext } from "@nestjs/common";
// import { AuthGuard } from "@nestjs/passport";

// /**
//  * Custom AuthGuard for the local strategy.
//  * Allows login using either 'email' or 'username' by unifying the login input.
//  */
// @Injectable()
// export class LocalAuthGuard extends AuthGuard("local") {
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request: any = context.switchToHttp().getRequest();
//     const { body } = request;
//     if (body.email) {
//       body.username = body.email;
//     }
//     return super.canActivate(context) as Promise<boolean>;
//   }
// }
