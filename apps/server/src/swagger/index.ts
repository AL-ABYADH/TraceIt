import { INestApplication } from "@nestjs/common";
import { SwaggerModule } from "@nestjs/swagger";
import { generateOpenApiDocument } from "./generator";
import "./auth.openapi"; // <-- auto-registers schemas and paths
import "./user.openapi"; // add more modules here
import "./project.openapi";
import "./actor.openapi";
export function setupSwagger(app: INestApplication) {
  const document = generateOpenApiDocument();
  SwaggerModule.setup("api", app, document as any);
}
