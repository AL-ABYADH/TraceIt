import { PipeTransform, Injectable } from "@nestjs/common";

@Injectable()
export class InjectUserIdPipe implements PipeTransform {
  transform(value: any) {
    // TODO: get user id from request after auth is implemented
    return { ...value, userId: 1 };
  }
}
