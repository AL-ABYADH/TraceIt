import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { JwtAuthGuard } from "./core/auth/guards/jwt-auth.guard";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { AuthService } from "./core/auth/services/auth.service";
import { setupSwagger } from "./swagger";
import { ModelRegistry } from "@repo/custom-neogma";
import { TokenBlacklistService } from "./core/auth/services/token-blacklist.service";

async function bootstrap() {
  ModelRegistry.getInstance().processPendingRelationships();
  ModelRegistry.getInstance().printFinalSummary();

  const app = await NestFactory.create(AppModule);

  app.use(morgan("combined"));

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const reflector = app.get(Reflector);
  const authService = app.get(AuthService);
  const blacklistService = app.get(TokenBlacklistService);
  app.useGlobalGuards(new JwtAuthGuard(reflector, authService, blacklistService));

  app.enableCors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  });

  // ✅ Swagger setup
  setupSwagger(app);

  await app.listen(8000, "0.0.0.0");
  const url = await app.getUrl();
  console.log(`Application is running on: ${url}`);
  console.log(`📚 Swagger docs available at: ${url}/api`);
}

bootstrap();
