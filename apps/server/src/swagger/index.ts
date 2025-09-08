import "./use-case/index";
import "./auth/index";
import "./actor/index";
import "./user/index";
import "./project/index";
import { INestApplication } from "@nestjs/common";
import { SwaggerModule } from "@nestjs/swagger";
import { generateOpenApiDocument } from "./generator";
export function setupSwagger(app: INestApplication) {
  const document = generateOpenApiDocument();
  SwaggerModule.setup("api", app, document as any, {
    jsonDocumentUrl: "api/openapi.json",
    customSiteTitle: "API Documentation",
  });
}
