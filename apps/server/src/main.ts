import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { JwtAuthGuard } from "./core/auth/guards/jwt-auth.guard";
import morgan from "morgan";
import cookieParser from "cookie-parser";

async function bootstrap() {
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
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.enableCors({
    origin: ["http://localhost:3000"],
    credentials: true,
  });

  await app.listen(8000, "0.0.0.0");
  const t = await app.getUrl();
  console.log(`Application is running on: ${t}`);
}

bootstrap();
