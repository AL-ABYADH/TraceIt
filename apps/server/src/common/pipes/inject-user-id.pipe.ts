import { PipeTransform, Injectable, ArgumentMetadata, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class InjectUserIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value.req?.user) {
      throw new UnauthorizedException();
    }

    return { ...value, userId: value.req.user.id };
  }
}
