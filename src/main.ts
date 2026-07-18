import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { apiReference } from '@scalar/nestjs-api-reference';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

const DEVELOPMENT_API_URL = 'http://localhost:3000';
const PRODUCTION_API_URL = 'https://asset-tracker-api-6fs8.onrender.com';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const apiUrl =
    process.env.NODE_ENV === 'production'
      ? (process.env.PUBLIC_API_URL ?? PRODUCTION_API_URL)
      : DEVELOPMENT_API_URL;
  const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:4200')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle('Asset Tracker API')
    .setDescription('Asset & valuation tracking API')
    .setVersion('1.0')
    .addServer(
      apiUrl,
      process.env.NODE_ENV === 'production'
        ? 'Production server'
        : 'Development server',
    )
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/reference',
    apiReference({
      spec: { content: document },
    }),
  );
  console.log(`API: ${apiUrl}`);
  console.log(`API documentation: ${apiUrl}/reference`);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().then();
